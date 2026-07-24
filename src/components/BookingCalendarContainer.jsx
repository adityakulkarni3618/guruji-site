"use client";

import { useState } from "react";
import BookingCalendar from "./BookingCalendar";
import BookingForm from "./BookingForm";

export default function BookingCalendarContainer({ dict, services, preselectedService, locale }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleSelect(selectedDate, selectedTime) {
    setDate(selectedDate);
    setTime(selectedTime);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Calendar selector */}
      <div className="space-y-4">
        <h2 className="text-brass text-lg font-semibold font-display pl-1 select-none">
          {locale === "en" ? "1. Select Date & Auspicious Slot" : locale === "hi" ? "1. तिथि और शुभ स्लॉट चुनें" : "1. तिथी आणि शुभ स्लॉट निवडा"}
        </h2>
        <BookingCalendar locale={locale} dict={dict} onSelect={handleSelect} />
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        <h2 className="text-brass text-lg font-semibold font-display pl-1 select-none">
          {locale === "en" ? "2. Provide Devotee Details" : locale === "hi" ? "2. भक्त का विवरण भरें" : "2. भक्ताची माहिती भरा"}
        </h2>
        <BookingForm
          dict={dict}
          services={services}
          preselectedService={preselectedService}
          initialDate={date}
          initialTime={time}
        />
      </div>
    </div>
  );
}
