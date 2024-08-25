import NewAppointmentForm from "@/components/forms/NewAppointmentForm ";
import PatientForm from "@/components/forms/PatientForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";


export default async function NewAppointment({params: {userId}}: SearchParamProps) {
   const patient = await getPatient(userId);
  Sentry.metrics.set("user_view_new-appointment", patient.name);

    return (
      <div className='flex h-screen max-h-screen'>
        <section className='remove-scrollbar container my-auto'>
          <div className='sub-container max-w-[860px] flex-1 justify-between'>
            {/* TODO: OPT verification */}
            <Image
              src='/assets/icons/logo-full.svg'
              height={1000}
              width={1000}
              alt='patient'
              className='mb-12 h-10 w-fit'
            />
            <NewAppointmentForm
              type='create'
              userId={userId}
              patientId={patient.$id}
            />
            <p className='copyright mt-10 py-12'>
              {" "}
              {new Date().getFullYear()}{" "}
              <Link
                href='https://zvitambodev.co.zw/'
                target='_blank'
                style={{ color: "green" }}
              >
                {"zvitamboDev"}
              </Link>{" "}
              &copy; All Rights Reserved
            </p>
          </div>
        </section>
        <Image
          src='/assets/images/appointment-img.png'
          height={1000}
          width={1000}
          alt='appointment'
          className='side-img max-w-[390px] bg-bottom'
        />
      </div>
    );
}
