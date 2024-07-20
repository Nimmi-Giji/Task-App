import Head from 'next/head'
import type { NextPage } from 'next'
import { useCallback, useState } from 'react'
import { trpc } from '@/utils/trpc'

import { 
  Card,
  CardContent,
  CardForm,
  CardHeader,
  List,
  ListItem,
} from '@/components'
import { TaskList } from '@prisma/client'

const Home: NextPage = () => {
  const [itemName, setItemName] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const { data: list, refetch } = trpc.findAll.useQuery();
  
  const insertMutation = trpc.insertOne.useMutation({
    onSuccess: () => {
      refetch();
      setItemName('');
      setItemDescription('');
      setEditingItemId(null);
    },
  });

  const updateMutation = trpc.updateOne.useMutation({
    onSuccess: () => {
      refetch();
      setItemName('');
      setItemDescription('');
      setEditingItemId(null);
    },
  });

  const deleteOneMutation = trpc.deleteOne.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteAllMutation = trpc.deleteAll.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteCheckedMutation = trpc.deleteChecked.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const insertOrUpdate = useCallback(() => {
    if (itemName === '') return;

    if (editingItemId !== null) {
      updateMutation.mutate({
        id: editingItemId,
        title: itemName,
        checked: false, 
        description: itemDescription,
      });
    } else {
      insertMutation.mutate({
        title: itemName,
        description: itemDescription,
      });
    }
  }, [itemName, itemDescription, editingItemId, insertMutation, updateMutation]);

  const clearAll = useCallback(() => {
    if (list?.length) {
      deleteAllMutation.mutate({
        ids: list.map((item) => item.id),
      });
    }
  }, [deleteAllMutation, list]);

  const deleteChecked = useCallback(() => {
    const checkedIds = list?.filter(item => item.checked).map(item => item.id) || [];
    if (checkedIds.length) {
      deleteCheckedMutation.mutate({
        ids: checkedIds,
      });
    }
  }, [deleteCheckedMutation, list]);

  const deleteOne = useCallback((id: number) => {
    deleteOneMutation.mutate({ id });
  }, [deleteOneMutation]);

  const updateOne = useCallback(
    (item: TaskList) => {
      updateMutation.mutate({
        id: item.id,
        title: item.title,
        checked: !item.checked,
        description: item.description ?? '', 
      });
    },
    [updateMutation]
  );

  const startEditing = (item: TaskList) => {
    setItemName(item.title);
    setItemDescription(item.description ?? '');
    setEditingItemId(item.id);
  };

  return (
    <>
      <Head>
        <title>Task List</title>
        <meta name="description" content="Task List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Card>
          <CardContent>
            <CardHeader
              title="Task List"
              listLength={list?.length ?? 0}
              clearAllFn={clearAll}
              deleteCheckedFn={deleteChecked} 
            />
            <List>
              {list?.map((item) => (
                <ListItem 
                  key={item.id} 
                  item={item} 
                  onUpdate={updateOne} 
                  onDelete={() => deleteOne(item.id)} 
                  onEdit={() => startEditing(item)} 
                />
              ))}
            </List>
          </CardContent>
          <CardForm
            value={itemName}
            description={itemDescription}
            onChange={(e) => setItemName(e.target.value)}
            onDescriptionChange={(e) => setItemDescription(e.target.value)} 
            submit={insertOrUpdate} 
            editingItemId={editingItemId} 
          />
        </Card>
      </main>
    </>
  )
}

export default Home;
