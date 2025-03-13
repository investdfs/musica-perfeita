
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface MusicFocusFieldProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const MusicFocusField = ({ form }: MusicFocusFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormField
      control={form.control}
      name="music_focus"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-purple-700">Foco da Música</FormLabel>
          <FormControl>
            <Textarea
              placeholder={!isFocused ? "EXEMPLO: Gostaria que a música focasse principalmente no nosso amor que superou a distância, quando ficamos 2 anos morando em países diferentes e mesmo assim conseguimos manter o relacionamento forte até que ela pudesse vir morar comigo." : ""}
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
            Descreva o aspecto mais importante que você gostaria que a música destacasse.
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MusicFocusField;
