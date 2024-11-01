<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/toast/use-toast'

import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { addTagReq } from '~/repository/Tags'
import { addTagsSchema } from '~/types/TagsDTO'

const formSchema = toTypedSchema(addTagsSchema)

const { userToken } = useFirebaseAuth()
const { toast } = useToast()
const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const emit = defineEmits(['tag-added'])

const onSubmit = handleSubmit(async (values) => {
  console.log('on suubmit')
  if (userToken.value) {
    console.log('submitted')
    await addTagReq({ token: userToken.value, id: values.id })
      .catch(error => {
        toast({
          variant: "destructive",
          title: 'failed to get data',
          description: error,
        });
      })
    emit('tag-added')
  }
})
</script>

<template>
  <div>
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="default">
          Add new tag
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new tag</DialogTitle>
          <DialogDescription>
            input your new tag:
          </DialogDescription>
        </DialogHeader>

        <form
          id="dialogForm"
          @submit="onSubmit"
        >
          <FormField
            v-slot="{ componentField }"
            name="id"
          >
            <FormItem>
              <FormLabel>tag</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="shadcn"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="dialogForm"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>