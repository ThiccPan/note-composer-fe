<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { Input } from '@/components/ui/input'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { useDebounceFn } from '@vueuse/core'
import { Trash } from 'lucide-vue-next'
import { deleteNoteReq, fetchNoteByIdReq, updateNoteReq } from '~/repository/Notes'
import type { updateNoteType } from '~/types/NoteDTO'

definePageMeta({
  middleware: 'auth' /* make sure user is authenticated */
})

const emit = defineEmits(['deleted'])

const formSchema = toTypedSchema(z.object({
  title: z.string().min(2).max(50),
  content: z.string(),
  tags: z.array(z.string())
}).partial({
  tags: true
}))

const { userToken } = useFirebaseAuth()
const route = useRoute()

const { handleSubmit, values, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    tags: [],
  },
})

const { toast } = useToast()
onMounted(async () => {
  const fetchedData = await fetchNoteByIdReq({
    token: userToken.value!,
    noteId: route.params.id as string
  })
    .catch((error) => {
      console.error(error)
    })

  if (fetchedData && fetchedData.value?.data) {
    const noteData = fetchedData.value.data
    const noteFromFetchRes = {
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tagsId
    }
    console.log('tags:', noteData.tagsId)
    if (!noteFromFetchRes.tags) noteFromFetchRes.tags = [] as string[]
    setValues(noteFromFetchRes)
  }

  toast({
    variant: "default",
    title: 'getting data successfull',
  });
})

const onSubmit = handleSubmit(async (values: updateNoteType) => {
  if (userToken.value) {
    console.log(values)
    const noteData = await updateNoteReq({
      token: userToken.value,
      noteId: route.params.id as string,
      updateNoteData: values
    })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: 'failed to update data',
          description: error,
        });
      })
    console.log("ads: ", noteData)
    console.log("update data successfull")
    toast({
      variant: "default",
      title: 'update data successfull',
    });
  }
})

const onDelete = () => {
  if (userToken.value) {
    deleteNoteReq({
      token: userToken.value,
      noteId: route.params.id as string,
    })
      .then(() => {
        toast({
          variant: "default",
          title: 'delete data successfull',
        });
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
</script>

<template>
  <form
    class="w-2/3 space-y-6"
    @submit="onSubmit"
  >
    <FormField
      v-slot="{ componentField }"
      name="title"
    >
      <FormItem>
        <FormLabel>Note title</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="title here..."
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ value }"
      name="tags"
    >
      <FormItem>
        <FormLabel>tags</FormLabel>
        <FormControl>
          <TagsInput :model-value="value">
            <TagsInputItem
              v-for="item in value"
              :key="item"
              :value="item"
            >
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>

            <TagsInputInput placeholder="tags..." />
          </TagsInput>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ componentField }"
      name="content"
    >
      <FormItem>
        <FormLabel>Content</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Insert note content here"
            class="resize-none"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex align-middle gap-2">
      <Button type="submit">
        Save
      </Button>
      <Button
        @click="onDelete()"
        variant="destructive"
      >
        <Trash class="w-4 h-4 mr-2" /> Delete
      </Button>
    </div>
  </form>
  <Toaster />
</template>