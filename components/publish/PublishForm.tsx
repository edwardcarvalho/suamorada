"use client";

import * as React from "react";
import { usePublishStore } from "./usePublishStore";
import { PublishProgress } from "./PublishProgress";
import { Step1Type }     from "./Step1Type";
import { Step2Location } from "./Step2Location";
import { Step3Details }  from "./Step3Details";
import { Step4Photos }   from "./Step4Photos";

export function PublishForm() {
  const { step, reset } = usePublishStore();

  // Limpa o formulário sempre que a página é aberta de novo
  React.useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-6 sm:p-8">
      <PublishProgress current={step} />

      {step === 1 && <Step1Type />}
      {step === 2 && <Step2Location />}
      {step === 3 && <Step3Details />}
      {step === 4 && <Step4Photos />}
    </div>
  );
}
