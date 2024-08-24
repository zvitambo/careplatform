"use client";

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
import { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from '@/components/ui/label';

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeHolder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}


const RenderField = ({ field, props }: { field: any, props: CustomProps }) => {
  
  const {fieldType, iconAlt, iconSrc, placeHolder, renderSkeleton, showTimeSelect, dateFormat, children, disabled} = props;
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className='ml-2'
            />
          )}
          <FormControl>
            <Input
              placeholder={placeHolder}
              {...field}
              className='shad-input border-0'
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeHolder}
            {...field}
            className='shad-textArea'
            disabled={disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry='ZW'
            placeholder={placeHolder}
            international
            withCountryCallingCode
            value={field.value || undefined} // as E164Number
            onChange={field.onChange}
            className='input-phone'
          />
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
          <Image
            src='/assets/icons/calendar.svg'
            height={24}
            width={24}
            alt='calendar'
            className='ml-2'
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? "MM/dd/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel='Time:'
              wrapperClassName='date-picker'
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className='shad-select-trigger'>
                <SelectValue placeholder={placeHolder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className='shad-select-content'>
              {children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className='flex items-center gap-4'>
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className='checkbox-label'>
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    default:
      break;
  }
};
const CustomFormField = (props: CustomProps) => {

  const { control, fieldType, name, label } = props
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormItem className='flex-1'>
            {fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel>{label}</FormLabel>
            )}
          </FormItem>

          <RenderField field={field} props={props}/>
          <FormMessage className="shad-error"/>
          {/* <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder='shadcn' {...field} />
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage /> */}
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
