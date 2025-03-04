
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface GenreSelectorProps {
  form: UseFormReturn<MusicRequestFormValues>;
}

const GenreSelector = ({ form }: GenreSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="music_genre"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-purple-700">Gênero de referência da música</FormLabel>
          <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="border-pink-200 focus-visible:ring-pink-400">
                <SelectValue placeholder="Selecione o gênero musical" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="romantic">Romântica</SelectItem>
              <SelectItem value="mpb">MPB</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="classical">Clássica</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
              <SelectItem value="hiphop">Hip-Hop</SelectItem>
              <SelectItem value="electronic">Eletrônica</SelectItem>
              <SelectItem value="country">Country</SelectItem>
              <SelectItem value="folk">Folk</SelectItem>
              <SelectItem value="reggae">Reggae</SelectItem>
              <SelectItem value="samba">Samba</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            É uma referência; o resultado pode mesclar gêneros.
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GenreSelector;
