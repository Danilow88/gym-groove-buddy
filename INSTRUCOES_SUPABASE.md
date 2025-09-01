# 🚀 Como Criar as Tabelas no Supabase

## 📋 **Passo a Passo Completo**

### **1. 📂 Abrir o SQL Editor**
1. Acesse: https://supabase.com/dashboard/project/gqpikdwbuxnxifgekwqr/sql
2. Faça login na sua conta Supabase
3. Vá para a aba **"SQL Editor"**

### **2. 📄 Copiar e Executar o SQL**
1. Abra o arquivo: `EXECUTE_IN_SUPABASE_DASHBOARD.sql`
2. **Copie TODO o conteúdo do arquivo**
3. **Cole no SQL Editor** do Supabase
4. Clique em **"Run"** para executar

### **3. ✅ Verificação**
Se tudo der certo, você verá mensagens de sucesso no final:
```
✅ Todas as tabelas foram criadas com sucesso!
✅ Admin yaraka78@gmail.com configurado!
✅ Políticas RLS aplicadas!
✅ Triggers configurados!
✅ Yara motivation está pronto para usar o Supabase! 🚀
```

---

## 📊 **Tabelas Criadas**

### **`workout_plans`** - Planos de Treino da Yara
- Armazena treinos personalizados criados pela admin
- Vinculados a usuários específicos
- Incluem exercícios e observações

### **`admin_configs`** - Configurações de Admin
- Define quem é administrador
- `yaraka78@gmail.com` já inserida como admin

### **`workout_sessions`** - Sessões de Treino
- Histórico de treinos realizados pelos usuários
- Data, duração e identificação do usuário

### **`workout_sets`** - Séries de Exercícios
- Detalhes de cada série: peso, repetições
- Vinculadas às sessões de treino

---

## 🔒 **Segurança RLS Configurada**

- ✅ **Usuários** veem apenas seus próprios dados
- ✅ **Admins** podem criar/ver/editar planos para qualquer usuário
- ✅ **Políticas automáticas** baseadas em email
- ✅ **Triggers** para timestamps automáticos

---

## 🔧 **Ativar Integração Supabase no Código**

### **Depois de executar o SQL:**

1. **Arquivo**: `src/hooks/use-admin.ts`
   - Descomentar linhas 54-55
   - Descomentar seções TODO

2. **Arquivo**: `src/hooks/use-workout.ts`
   - Descomentar linhas 798-807
   - Descomentar linhas 822-828

3. **Reiniciar o servidor React**:
   ```bash
   # Parar o servidor (Ctrl+C)
   # Depois rodar:
   npm run dev
   ```

---

## 🎯 **O que Acontece Após Executar**

### **✅ Funcionalidades Ativas:**
- **Planos de treino** salvos no Supabase
- **Histórico** persistido na nuvem
- **Sincronização** entre dispositivos
- **Backup automático** dos dados

### **📱 Como Testar:**
1. Acesse `http://localhost:8080`
2. Faça login com `yaraka78@gmail.com`
3. Vá para aba "Admin"
4. Digite senha: `dedunha571`
5. Crie um plano de treino
6. **Dados serão salvos no Supabase! 🎉**

---

## 🆘 **Em Caso de Erro**

### **Se der erro ao executar:**
1. **Verificar conexão** com internet
2. **Conferir permissões** no projeto Supabase
3. **Executar linha por linha** no SQL Editor
4. **Verificar logs** no Dashboard > Logs

### **Contato:**
- Projeto Supabase: `gqpikdwbuxnxifgekwqr`
- Admin: `yaraka78@gmail.com`

---

## 🎉 **Resultado Final**

Após executar o SQL, o **Yara motivation** terá:
- ✅ **4 tabelas** criadas no Supabase
- ✅ **Segurança RLS** completa
- ✅ **Admin configurada** (yaraka78@gmail.com)
- ✅ **Funções utilitárias** ativas
- ✅ **Tipos TypeScript** atualizados
- ✅ **Integração pronta** para usar!

**Basta executar o arquivo SQL e descomentar as linhas TODO no código! 🚀**
