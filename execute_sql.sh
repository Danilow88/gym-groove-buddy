#!/bin/bash

# Script para executar SQL no Supabase via REST API
# Projeto: gqpikdwbuxnxifgekwqr

SUPABASE_URL="https://gqpikdwbuxnxifgekwqr.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxcGlrZHdidXhueGlmZ2Vrd3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUxNTk0NjIsImV4cCI6MjA0MDczNTQ2Mn0.kcWKDXzKtarruaZc-1fMBz2c9pJNPHdN2chBdXGdaBQ"

# Executar SQL para criar tabela admin_configs primeiro
echo "🚀 Executando SQL no Supabase..."

# 1. Criar tabela admin_configs
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS public.admin_configs (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, admin_email TEXT NOT NULL UNIQUE, is_active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now());"
  }'

echo "✅ Admin configs table created"

# 2. Inserir admin
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d '{
    "sql": "INSERT INTO public.admin_configs (admin_email) VALUES ('\''yaraka78@gmail.com'\'') ON CONFLICT (admin_email) DO NOTHING;"
  }'

echo "✅ Admin user inserted"

# 3. Criar tabela workout_plans
curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS public.workout_plans (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, name TEXT NOT NULL, exercises JSONB NOT NULL DEFAULT '\''[]'\''::jsonb, observations TEXT, created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now());"
  }'

echo "✅ Workout plans table created"
echo "🎉 Tabelas criadas no Supabase com sucesso!"
