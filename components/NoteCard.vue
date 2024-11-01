<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { deleteNoteReq } from '~/repository/Notes';
import type { Note } from '~/types/types';
import { useToast } from '@/components/ui/toast/use-toast'
import { Eye, Trash } from 'lucide-vue-next';

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits(['deleted'])
const { user, userToken } = useFirebaseAuth()
const { toast } = useToast()
async function deleteNote(noteId: string) {
  if (userToken.value) {
    deleteNoteReq({
      token: userToken.value,
      noteId: noteId,
    })
      .then(() => {
        toast({
          variant: "default",
          title: 'delete data successfull',
        });
        emit("deleted")
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: 'failed to delete data',
          description: error,
        });
      })
  }
}

const getBlurb = (text: string) => {
  if (text.length > 40) {
    return text.substring(0, 37) + '...'
  }
  return text
}
</script>

<template>
  <Card class="my-2 max-w-screen-sm hover:shadow-xl">
    <CardHeader>
      <CardTitle>{{ note.title }}</CardTitle>
      <CardDescription>
        {{ note  }}
        <template
          v-for="tag in note.tagsId"
          class=" flex flex-row"
        >
          {{ tag }},
        </template>
      </CardDescription>

    </CardHeader>
    <CardContent>
      <div>
        <NuxtLink :to="`/notes/${note.id}`">
          {{ getBlurb(note.content) }}
        </NuxtLink>
      </div>
    </CardContent>
    <CardFooter>
      <Button
        @click="navigateTo(`/notes/${note.id}`)"
        size="icon"
        variant="default"
        class="mr-4"
      >
        <Eye class="h-4 w-4" />
      </Button>
      <Button
        @click="deleteNote(note.id)"
        size="icon"
        variant="destructive"
        class=""
      >
        <Trash class="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
</template>