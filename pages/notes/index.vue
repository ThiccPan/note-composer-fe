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
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { addNoteSchema, type addNoteType } from '~/types/NoteDTO'
import { addNoteReq } from '~/repository/Notes'
import type { Tag } from '~/types/types'
import { fetchTagReq } from '~/repository/Tags'

const { toast } = useToast()

definePageMeta({
  middleware: 'auth' /* make sure user is authenticated */
})

const { user, userToken } = useFirebaseAuth()

const tags = ref<Tag[]>([])
onMounted(() => {
  // tags value fetched by api calls
  const token = userToken.value as string
  fetchTagReq({ token: token })
    .then((res) => {
      if (res.value) {
        tags.value = res.value.data
        console.log("done:", res)
      }
    })
    .catch((error) => {
      console.error(error)
    })
})

const veeFormSchema = toTypedSchema(addNoteSchema)
const { handleSubmit, setFieldValue } = useForm({
  validationSchema: veeFormSchema,
  initialValues: {
    tags: [],
  },
})

const onSubmit = handleSubmit(async (values: addNoteType) => {
  console.log(values)
  const token = userToken.value as string
  addNoteReq({
    token: token,
    addNoteData: values
  })
    .then((data) => {
      toast({
        variant: "default",
        title: data.value?.message,
      });
    })
    .catch((error) => {
      toast({
        variant: "destructive",
        title: 'failed to add data',
        description: error,
      });
    })
})

const deletedTagHandler = (tagId: string) => {
  if (user && userToken.value) {
    toast({
      variant: 'destructive',
      title: 'tag deleted successfully',
    });
    fetchTagReq({ token: userToken.value })
      .then((res) => {
        if (res.value) {
          tags.value = res.value.data
          console.log('done:', res)
        }
      })
      .catch((error) => {
        console.error(error)
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
      v-slot="{ value, setValue }"
      name="tags"
    >
      <FormItem>
        <FormLabel>tags</FormLabel>
        <FormControl>
          <Tags
            :token="userToken!"
            :tags="tags"
            @tag-selected="(tags: string[]) => {
              setValue(tags, true)
            }"
            @tag-deleted="(tagId: string) => deletedTagHandler(tagId)"
          />
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

    <Button type="submit">
      Submit
    </Button>
  </form>
  <Toaster />
</template>