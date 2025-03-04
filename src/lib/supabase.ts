
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://afybpsjzhzhrxlhlpxyw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeWJwc2p6aHpocnhsaGxweHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTI3MjEsImV4cCI6MjA1NjY2ODcyMX0.xRTolYeT2B0KZefb_pxZdREi87G7F34XdFBywkPGIGA';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
