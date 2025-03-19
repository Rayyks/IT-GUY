"use client";

import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/ui/announcement";
import { ArrowUpRightIcon } from "lucide-react";

export const InputError = ({ error, errorType }) => {
  return (
    <Announcement themed className="bg-rose-100 text-rose-700">
      <AnnouncementTag>{errorType}</AnnouncementTag>
      <AnnouncementTitle>
        {error?.message || error}
        <ArrowUpRightIcon size={16} className="shrink-0 opacity-70" />
      </AnnouncementTitle>
    </Announcement>
  );
};

export default InputError;
