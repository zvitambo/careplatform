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
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "../../constants/index";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      phone: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
          treatmentConsent: values.treatmentConsent,
          disclosureConsent: values.disclosureConsent,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patient/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-12 flex-1'
      >
        <section className='mb-12 space-y-4'>
          <h1 className='header'>Welcome 👋</h1>
          <p className='text-dark-700'>Let us know more about yourself.</p>
        </section>
        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Personal Information</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='name'
          label='name'
          placeHolder='zvitambo'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
        />
        <div className='flex flex-col gap-6xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='email'
            label='email'
            placeHolder='tjindu1@gmail.com'
            iconSrc='/assets/icons/email.svg'
            iconAlt='email'
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name='phone'
            label='phone number'
            placeHolder='(555) 123-4567'
          />
        </div>
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name='birthDate'
            label='Date of Birth'
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name='gender'
            label='Gender'
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className='flex h-11 gap-6 xl:justify-between'
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option, i) => (
                    <div key={option + i} className='radio-group'>
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className='cursor-pointer'>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='address'
            label='Address'
            placeHolder='9th avenue, Bulawayo'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='occupation'
            label='Occupation'
            placeHolder='Software Engineer'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='emergencyContactName'
            label='emergency contact name'
            placeHolder="Guardian's name"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name='emergencyContactNumber'
            label='emergency contact number'
            placeHolder='(555) 123-4567'
          />
        </div>
        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Medical Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name='primaryPhysician'
          label='primary physician'
          placeHolder='Select a physician'
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
        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='insuranceProvider'
            label='insurance provider'
            placeHolder='National Insurance'
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='insurancePolicyNumber'
            label='insurance policy number'
            placeHolder='IPN123456'
          />
        </div>

        <div className='flex flex-col gap-6xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='allegies'
            label='Allergies (if any)'
            placeHolder='Peanuts, Penicillin, Pollen'
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='currentMedication'
            label='current medication  (if any)'
            placeHolder='Ibuprofen 200mg, Paracetemol 500mg'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='familyMedicalHistory'
            label='family medical history'
            placeHolder='high blood pressure'
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='pastMedicalHistory'
            label='past medical history'
            placeHolder='Appendectomy, Tonsillectomy'
          />
        </div>
        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name='identificationType'
          label='identification type'
          placeHolder='Select a  identification type'
        >
          {IdentificationTypes.map((type) => {
            return (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            );
          })}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='identificationNumber'
          label='identification number'
          placeHolder='12345678'
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name='identificationDocument'
          label='scanned copy of identification document'
          renderSkeleton={(field) => {
            return (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            );
          }}
        />

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='treatmentConsent'
          label='I consent to treatment'
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='disclosureConsent'
          label='I consent to disclosure of information'
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='privacyConsent'
          label='I consent to privacy policy'
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
export default RegisterForm;
