"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { updateAppointment } from "@/lib/actions/appointment.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

const NewAppointmentForm = ({
  type,
  userId,
  patientId,
  appointment,
  setOpen,
}: {
  type: "create" | "cancel" | "schedule";
  userId: string;
  patientId: string;
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({
    primaryPhysician,
    schedule,
    reason,
    note,
    cancellationReason,
  }: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;

    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;

      default:
        status = "pending";
        break;
    }

    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: primaryPhysician,
          schedule: new Date(schedule),
          reason: reason!,
          note: note,
          status: status as Status,
        };
        const newAppointment = await createAppointment(appointmentData);
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: primaryPhysician,
            schedule: new Date(schedule),
            status: status as Status,
            cancellationReason: cancellationReason,
          },
          type,
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-6'>
        {type === "create" && (
          <section className='mb-12 space-y-4'>
            <h1 className='header'>New Appointment👋</h1>
            <p className='text-dark-700'>Schedule your first appointment.</p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name='primaryPhysician'
              label='Doctor'
              placeHolder='Select a doctor'
            >
              {Doctors.map((doctor) => {
                return (
                  <SelectItem key={doctor.image} value={doctor.name}>
                    <div className='flexlcursor-pointer items-center gap-2'>
                      <Image
                        src={doctor.image}
                        height={32}
                        width={32}
                        alt={doctor.name}
                        className='rounded-full border border-dark-500'
                      />
                      <p>{doctor.name}</p>
                    </div>
                  </SelectItem>
                );
              })}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='schedule'
              label='Expected appointment date'
              showTimeSelect
              dateFormat='MM/dd/yyyy - h:m aa'
            />
            {/* <div
              className={`flex flex-col gap-6  ${
                type === "create" && "xl:flex-row"
              }`}
            > */}
            <div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='reason'
                label='Reason for appointment'
                placeHolder='Enter reason for appointment '
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='note'
                label='Notes'
                placeHolder='Enter notes'
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='cancellationReason'
            label='Reason for cancellation'
            placeHolder='Enter reason for cancellation'
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
export default NewAppointmentForm;
