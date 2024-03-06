import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { useCallback, useState } from "react";

type QuestionSelectorProps = {};

export function QuestionSelector({}: QuestionSelectorProps) {
  const [open, setOpen] = useState(false);
  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex h-8 w-full justify-between">
          <span>Select question</span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px]">
        <Command className="">
          <CommandInput placeholder="Search question..." />
          <CommandEmpty>No question found.</CommandEmpty>
          <CommandGroup>
            <CommandItem onSelect={() => runCommand(() => console.log("oi!"))}>
              <span>Item</span>
            </CommandItem>
            <CommandItem>
              <span>Item 2</span>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
