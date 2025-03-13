
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface HappyMemoryFieldProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const HappyMemoryField = ({ form }: HappyMemoryFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormField
      control={form.control}
      name="happy_memory"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-purple-700">Lembrança Feliz</FormLabel>
          <FormControl>
            <Textarea
              placeholder={!isFocused ? "EXEMPLO: O dia em que fomos ao parque de diversões e ele, mesmo com medo de altura, entrou na montanha-russa comigo só para me fazer feliz. Ele gritou o tempo todo, mas ao final, entre risadas, me disse que faria tudo de novo só para ver meu sorriso." : ""}
              className="min-h-[120px] border-pink-200 focus-visible:ring-pink-400 text-gray-900 bg-white"
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                if (!field.value) {
                  setIsFocused(false);
                }
              }}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <p className="text-xs italic text-gray-600 mt-2">
            Conte um momento especialmente feliz que marcou a vida da pessoa homenageada.
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default HappyMemoryField;
