
import { z } from "zod";

export const musicRequestSchema = z.object({
  honoree_name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  relationship_type: z.enum([
    "esposa", "noiva", "namorada", "amigo_especial", "partner", "friend", "family", 
    "colleague", "mentor", "child", "sibling", "parent", "other"
  ], {
    required_error: "Selecione o tipo de relacionamento",
  }),
  custom_relationship: z.string().nullable().optional(),
  music_genre: z.enum([
    "romantic", "mpb", "classical", "jazz", "hiphop", 
    "rock", "country", "reggae", "electronic", "samba", "folk", "pop"
  ], {
    required_error: "Selecione o gênero musical",
  }),
  include_names: z.boolean().default(false),
  names_to_include: z.string().nullable().optional(),
  story: z.string().min(50, { message: "Conte sua história com pelo menos 50 caracteres" }),
});

export type MusicRequestFormValues = z.infer<typeof musicRequestSchema>;
