
-- Adiciona campo para detalhes técnicos das músicas
ALTER TABLE public.music_requests ADD COLUMN technical_details TEXT DEFAULT NULL;
