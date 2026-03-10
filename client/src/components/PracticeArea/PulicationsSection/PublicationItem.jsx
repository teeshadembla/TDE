import React from "react";

const PublicationItem = ({ publication }) => {

  const date = publication?.publishingDate
    ? new Date(publication.publishingDate)
    : null;

  const formattedDate = date
    ? date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "";

  const authors =
    publication?.Authors?.map((a) => a.FullName).join(", ");

  return (
    <div className="flex relative box-border bg-[#DBDBDC] text-[#333] font-sans text-[16px] leading-[20px] rounded-[8px] p-[24px] h-[240px] w-[640px]">

      <img
        src={publication?.thumbnailUrl}
        className="block h-[192px] w-[138.012px] max-w-full object-cover"
      />

<div className="flex flex-col gap-[6px] h-[192px] w-full pl-[20px] font-['DM_Sans',Arial,sans-serif]">
        <a
          href={`/research-paper/${publication?._id}`}
          className="bg-[#EAEAEC] text-[#6F6F6F] font-['DM_Sans'] text-[16px] leading-[20px] text-center cursor-pointer rounded-[20px] px-[15px] py-[9px] h-[38px] w-[160px]"
        >
          {publication?.documentType}
        </a>

<h4 className="text-[20.8px] font-semibold leading-[24.96px] mt-[6px] mb-[2px] line-clamp-2">          {publication?.title}
        </h4>

        <div className="flex gap-[6px] text-[12px] text-[#6F6F6F]">
          <span>Author:</span>
          <span className="truncate">{authors}</span>
        </div>

        <div className="text-[12px] text-[#6F6F6F]">
          {formattedDate}
        </div>

      </div>
    </div>
  );
};

export default PublicationItem;