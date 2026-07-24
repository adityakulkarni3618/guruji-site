"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";

export default function EditServicePage() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/services/${id}`)
      .then((r) => r.json())
      .then(setService);
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl text-cream mb-6">Edit Service / Pooja</h1>
      {service ? <ServiceForm initial={service} serviceId={id} /> : <p className="text-cream-dim">Loading…</p>}
    </div>
  );
}
