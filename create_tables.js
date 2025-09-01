import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gqpikdwbuxnxifgekwqr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcGlrZHdidXhueGlmZ2Vrd3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUxNTk0NjIsImV4cCI6MjA0MDczNTQ2Mn0.kcWKDXzKtarruaZc-1fMBz2c9pJNPHdN2chBdXGdaBQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTables() {
  console.log('🚀 Criando tabelas no Supabase...');

  try {
    // 1. Criar tabela admin_configs
    console.log('📋 Criando tabela admin_configs...');
    const { data: adminTable, error: adminError } = await supabase
      .rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS public.admin_configs (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            admin_email TEXT NOT NULL UNIQUE,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          );
        `
      });

    if (adminError) {
      console.log('❌ Erro ao criar admin_configs:', adminError.message);
      
      // Tentar inserir diretamente na tabela
      console.log('🔄 Tentando método alternativo...');
      
      // Inserir admin diretamente
      const { data: insertData, error: insertError } = await supabase
        .from('admin_configs')
        .insert([{ admin_email: 'yaraka78@gmail.com' }])
        .select();
        
      if (insertError) {
        console.log('ℹ️  Info sobre insert:', insertError.message);
      } else {
        console.log('✅ Admin inserido:', insertData);
      }
      
    } else {
      console.log('✅ Tabela admin_configs criada');
    }

    // 2. Tentar criar tabela workout_plans
    console.log('📋 Criando tabela workout_plans...');
    const { data: workoutTable, error: workoutError } = await supabase
      .rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS public.workout_plans (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            name TEXT NOT NULL,
            exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
            observations TEXT,
            created_by UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          );
        `
      });

    if (workoutError) {
      console.log('❌ Erro ao criar workout_plans:', workoutError.message);
    } else {
      console.log('✅ Tabela workout_plans criada');
    }

    // 3. Verificar se tabelas existem listando todas
    console.log('🔍 Verificando tabelas existentes...');
    const { data: tables, error: listError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (listError) {
      console.log('❌ Erro ao listar tabelas:', listError.message);
    } else {
      console.log('📊 Tabelas encontradas:', tables?.map(t => t.table_name));
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }

  console.log('🎉 Processo concluído!');
}

createTables();
