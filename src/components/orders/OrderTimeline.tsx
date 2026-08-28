import React from 'react';
import { CheckCircle2, Clock, Truck, Home, XCircle } from 'lucide-react';
import { OrderTimelineStep, OrderStatus } from '../../types';
import { formatDateTime } from '../../utils/formatters';

interface OrderTimelineProps {
  timeline: OrderTimelineStep[];
  currentStatus: OrderStatus;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ timeline, currentStatus }) => {
  const getStepIcon = (step: string, completed: boolean) => {
    switch (step) {
      case 'pending':
        return <Clock className={`w-4 h-4 ${completed ? 'text-apsara-espresso' : 'text-apsara-espresso/40'}`} />;
      case 'processing':
        return <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-apsara-camel' : 'text-apsara-espresso/40'}`} />;
      case 'shipped':
        return <Truck className={`w-4 h-4 ${completed ? 'text-apsara-sandstone' : 'text-apsara-espresso/40'}`} />;
      case 'delivered':
        return <Home className={`w-4 h-4 ${completed ? 'text-emerald-700' : 'text-apsara-espresso/40'}`} />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="py-4">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-apsara-camel/30">
        {timeline.map((step, idx) => {
          const isCompleted = step.completed;
          const isCurrent = currentStatus === step.step;

          return (
            <div key={idx} className="relative group">
              {/* Step indicator node */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isCompleted
                    ? 'bg-[#FAF7F2] border-[#D4AF37] ring-4 ring-[#FAF7F2]'
                    : 'bg-[#FAF7F2] border-apsara-camel/30 ring-4 ring-[#FAF7F2]'
                }`}
              >
                {getStepIcon(step.step, isCompleted)}
              </div>

              {/* Step content */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h5
                    className={`font-serif text-base ${
                      isCurrent
                        ? 'text-apsara-espresso font-semibold'
                        : isCompleted
                        ? 'text-apsara-espresso'
                        : 'text-apsara-espresso/45'
                    }`}
                  >
                    {step.title}
                  </h5>
                  {step.timestamp && (
                    <span className="text-[11px] font-mono text-apsara-camel">
                      {formatDateTime(step.timestamp)}
                    </span>
                  )}
                </div>

                {step.note && (
                  <p className="text-xs text-apsara-espresso/70 mt-1 font-light bg-apsara-cream/60 p-2 border border-apsara-camel/20">
                    {step.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
