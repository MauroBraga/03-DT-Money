import * as Dialog from '@radix-ui/react-dialog';
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import { zodResolver } from '@hookform/resolvers/zod';
import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from './styles';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { api } from '../../lib/axios';


const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
});

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>;

export function NewTransactionModal() {

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      type: 'income'
    }
  })

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    const { description, price, category, type } = data;

    await api.post('transactions',{
      description,
      price,
      category,
      type,
      createdAt: new Date()
    });

    reset();
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova Transação</Dialog.Title>

        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input type="text" placeholder="Descrição" {...register('description') } required />
          <input type="number" placeholder="Preço" {...register('price', { valueAsNumber: true })} required />
          <input type="text" placeholder="Categoria" {...register('category')} required />

        <Controller
            control={control}
            name='type'
            render={({field}) =>{
              return(
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>
                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
        />

          

          <button type="submit"  disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}