import {
  CheckCircle2,
  FileTextIcon,
  FileUpIcon,
  HelpCircleIcon,
  Layers3Icon,
} from "lucide-react";

export const questionStatuses = [
  {
    value: "unanswered",
    label: "Unanswered",
    icon: HelpCircleIcon,
  },
  {
    value: "answered",
    label: "Answered",
    icon: CheckCircle2,
  },
  {
    value: "duplicate",
    label: "Duplicate",
    icon: Layers3Icon,
  },
];

export const postStatuses = [
  {
    value: "draft",
    label: "Draft",
    icon: FileTextIcon,
  },
  {
    value: "published",
    label: "Published",
    icon: FileUpIcon,
  },
];
