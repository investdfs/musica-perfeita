
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface ToneAndVoiceFieldsProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const ToneAndVoiceFields = ({ form }: ToneAndVoiceFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="music_tone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-purple-700">Tom da Música</FormLabel>
            <Select 
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-pink-200 focus-visible:ring-pink-400 bg-white text-gray-900">
                  <SelectValue placeholder="Selecione o tom da música" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white text-gray-900">
                <SelectItem value="happy">Feliz e animada</SelectItem>
                <SelectItem value="romantic">Romântica e emotiva</SelectItem>
                <SelectItem value="nostalgic">Nostálgica</SelectItem>
                <SelectItem value="fun">Divertida</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Escolha o tom emocional que deseja para a sua música.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="voice_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-purple-700">Voz e Interpretação</FormLabel>
            <Select 
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-pink-200 focus-visible:ring-pink-400 bg-white text-gray-900">
                  <SelectValue placeholder="Selecione o tipo de voz" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white text-gray-900">
                <SelectItem value="male">Voz Masculina</SelectItem>
                <SelectItem value="female">Voz Feminina</SelectItem>
                <SelectItem value="male_romantic">Voz Masculina Romântica</SelectItem>
                <SelectItem value="female_romantic">Voz Feminina Romântica</SelectItem>
                <SelectItem value="male_folk">Voz Masculina Folk/MPB</SelectItem>
                <SelectItem value="female_folk">Voz Feminina Folk/MPB</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Escolha o estilo de voz para a sua música.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ToneAndVoiceFields;
