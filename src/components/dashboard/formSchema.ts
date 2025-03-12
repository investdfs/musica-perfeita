
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
  music_tone: z.enum([
    "happy", "romantic", "nostalgic", "fun", "melancholic", "energetic", "peaceful", "inspirational"
  ], {
    required_error: "Selecione o tom da música",
  }),
  voice_type: z.enum([
    "male", "female", "male_romantic", "female_romantic", "male_folk", "female_folk",
    "male_deep", "female_powerful", "male_soft", "female_sweet"
  ], {
    required_error: "Selecione o tipo de voz",
  }),
  include_names: z.boolean().default(false),
  names_to_include: z.string().nullable().optional(),
  story: z.string().min(50, { message: "Conte sua história com pelo menos 50 caracteres" }),
  music_focus: z.string().min(10, { message: "Descreva o foco da música com pelo menos 10 caracteres" }).optional(),
  happy_memory: z.string().min(10, { message: "Descreva uma lembrança feliz com pelo menos 10 caracteres" }).optional(),
  sad_memory: z.string().min(10, { message: "Descreva uma lembrança triste com pelo menos 10 caracteres" }).optional(),
});

export type MusicRequestFormValues = z.infer<typeof musicRequestSchema>;
