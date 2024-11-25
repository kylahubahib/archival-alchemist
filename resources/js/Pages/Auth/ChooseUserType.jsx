import React from 'react';
import Stepper from '@/Components/Stepper';
import { Radio, RadioGroup, cn } from '@nextui-org/react';

export const CustomRadio = (props) => {
    const {children, ...otherProps} = props;

    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
            "flex-row-reverse max-w-[500px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
            "data-[selected=true]:border-primary"
          ),
        }}
      >
        {children}
      </Radio>
    );
  };


export default function ChooseUserType({ nextStep, handleChange, values, errors }) {
    const { role } = values;

    const continueStep = (e) => {
        e.preventDefault();
        nextStep();
    };

    return (
        <div className="space-y-4 justify-center">
            <h2 className="text-2xl text-center font-bold mb-4">What type of user are you?</h2>
            <Stepper steps={['1', '2', '3']} currentStep={1} />
            <form onSubmit={continueStep} className="mt-4">
                <div className="space-y-4">
                    <RadioGroup label="Select a role"
                     value={role}
                     onChange={handleChange('role')}>
                        <CustomRadio description="Students can share their capstone manuscripts" value="student">
                            Student
                        </CustomRadio>
                        <CustomRadio description="Teacher can create classes and evaluate the work of the students" value="teacher">
                            Teacher
                        </CustomRadio>
                        <CustomRadio
                            description="University Representative manages the subscription and users of their institution"
                            value="admin"
                        >
                            University Representative
                        </CustomRadio>
                        <CustomRadio
                            description="Tech enthusiasts, independent researchers, industry professionals, and lifelong learners."
                            value="general_user"
                        >
                            General User
                        </CustomRadio>
                    </RadioGroup>
                </div>
                <div className="mt-4 flex justify-end">
                    <button type="submit" className="btn btn-primary">Next</button>
                </div>
            </form>
        </div>
    );
}
