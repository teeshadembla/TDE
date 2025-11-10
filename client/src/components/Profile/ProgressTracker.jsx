import React, { useState, useContext, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle, FileText, Search, DollarSign, Users } from 'lucide-react';
// Visual Progress Tracker Component
  const ProgressTracker = ({  status }) => {
    const stages = [
      { id: 1, name: 'Application', icon: FileText },
      { id: 2, name: 'Review', icon: Search },
      { id: 3, name: 'Payment', icon: DollarSign },
      { id: 4, name: 'Onboarding', icon: Users }
    ];

    const isRejected = status === 'REJECTED';
    var currentStage = 1;

    if(status === 'APPROVED'){
        currentStage = 3;
    }else if(status === 'CONFIRMED'){
        currentStage = 4;
    }else if(status === 'PENDING_REVIEW'){
        currentStage = 2;
    }else if(status === 'REJECTED'){
        currentStage = 2;
    }

    return (
      <div className="mb-6 px-4 py-6 bg-[#1a1a1a] rounded-lg border border-[#474646]">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#474646] -z-10">
            <div 
              className={`h-full transition-all duration-500 ${
                isRejected ? 'bg-[#888888]' : 'bg-[#004aad]'
              }`}
              style={{ width: `${isRejected ? 0 : ((currentStage - 1) / (stages.length - 1)) * 100}%` }}
            />
          </div>

          {stages.map((stage, index) => {
            const StageIcon = stage.icon;
            const isCompleted = currentStage > stage.id;
            const isCurrent = currentStage === stage.id;
            const isPending = currentStage < stage.id;

            return (
              <div key={stage.id} className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRejected && stage.id > 1
                      ? 'bg-[#2a2a2a] border-2 border-[#474646]'
                      : isCompleted
                      ? 'bg-[#004aad] border-2 border-[#004aad]'
                      : isCurrent
                      ? 'bg-[#062c65] border-2 border-[#004aad] ring-4 ring-[#004aad]/35'
                      : 'bg-[#2a2a2a] border-2 border-[#474646]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-[#ffffff]" />
                  ) : (
                    <StageIcon
                      className={`w-5 h-5 ${
                        isRejected && stage.id > 1
                          ? 'text-[#004aad]'
                          : isCurrent
                          ? 'text-[#aae7ff]'
                          : 'text-[#004aad]'
                      }`}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-sm font-medium ${
                    isRejected && stage.id > 1
                      ? 'text-[#888888]'
                      : isCompleted || isCurrent
                      ? 'text-[#ffffff]'
                      : 'text-[#888888]'
                  }`}
                >
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rejection Notice */}
        {isRejected && (
          <div className="mt-4 flex items-center gap-2 text-[#f6f5f5] bg-[#2a2a2a] px-4 py-2 rounded-lg">
            <XCircle className="w-4 h-4 text-[#888888]" />
            <span className="text-sm">Application not selected</span>
          </div>
        )}
      </div>
    );
  };

    export default ProgressTracker;