<script setup lang="ts">
import AddTags from '~/components/AddTags.vue';
import Tags from '~/components/tags.vue';
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useDebounceFn } from '@vueuse/core';
import { ArrowLeft, ArrowRight, Plus, PlusCircle, Search, Trash } from 'lucide-vue-next';
import { fetchNotesReq } from '~/repository/Notes';
import type { Note, Tag } from '~/types/types';
import { fetchTagReq } from '~/repository/Tags';

const { toast } = useToast()

definePageMeta({
  middleware: 'auth' /* make sure user is authenticated */
})

const { user, userToken } = useFirebaseAuth()

const assignTagsData = (token: string) => {
  // tags value fetched by api calls
  fetchTagReq({ token: token })
    .then((res) => {
      if (res.value) {
        tags.value = res.value.data
        console.log("done:", res)
      }
    })
    .catch((error) => {
      throw createError({
        ...error.value,
        message: 'cannot fetch and assign tag data',
      })
    })
}

onMounted(async () => {
  console.log("mounted")
  if (user.value && userToken.value) {
    const token = userToken.value
    fetchNotesReq({
      token: token,
    })
      .then(result => {
        if (result.value?.data) {
          notes.value = result.value?.data
        }
      })
      .catch(error => {
        toast({
          variant: "destructive",
          title: 'failed to get data',
          description: error,
        });
      })

    assignTagsData(token)
  }
})

const notes = ref<Note[]>([])
const tags = ref<Tag[]>([])
const searchQueryVal = ref<string>("")
const tagsQueryVal = ref<string[]>([])
const orderQueryVal = ref<"asc" | "desc">("desc")
function setTagsQueryVal(newVal: string[]) {
  console.log('called with val:', newVal)
  tagsQueryVal.value = newVal
}

const startAt = ref<string>("")
const endAt = ref<string>("")
const onNext = () => {
  console.log('next clicked')
  const lastNote = notes.value.at(notes.value.length - 1)
  console.log(lastNote!.updatedAt.toString())
  startAt.value = lastNote!.updatedAt.toString()
  endAt.value = ""
}

const onPrev = () => {
  console.log('prev clicked')
  const firstNote = notes.value.at(0)
  console.log(firstNote!.updatedAt.toString())
  startAt.value = ""
  endAt.value = firstNote!.updatedAt.toString()
}

const onInput = useDebounceFn(() => {
  console.log('oninput')
  searchWithTask()
}, 1000)
watch([searchQueryVal, tagsQueryVal, orderQueryVal, startAt, endAt], () => {
  console.log("watch called")
  onInput()
})

// make api call to search note with matching criteria
const searchWithTask = () => {
  console.log("search note with criteria:", searchQueryVal.value, tagsQueryVal.value)
  if (user && userToken.value) {
    const token = userToken.value
    fetchNotesReq({
      token: token,
      search: searchQueryVal.value,
      order: orderQueryVal.value!,
      tagsId: tagsQueryVal.value!,
      after: startAt.value,
      before: endAt.value,
    })
      .then(result => {
        if (result.value?.data) {
          notes.value = result.value?.data
        }
      })
      .catch(error => {
        toast({
          variant: "destructive",
          title: 'failed to get data',
          description: error,
        });
      })
  }
}

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
  <div class="flex flex-row items-center gap-2">
    <NuxtLink to="/notes">
      <Button class="my-2">
        <Plus class="w-4 h-4 mr-2" /> Add new note
      </Button>
    </NuxtLink>
    <AddTags @tag-added="assignTagsData(userToken!)" />
  </div>
  <div class="relative w-full max-w-sm items-center my-2">
    <Input
      v-model:model-value="searchQueryVal"
      id="search"
      type="text"
      placeholder="Search..."
      class="pl-10"
      @input="onInput"
    />
    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <Search class="size-6 text-muted-foreground" />
    </span>
  </div>
  <Tags
    class="my-2"
    :token="userToken!"
    :tags="tags"
    @tag-selected="(tags: string[]) => {
      console.log('tagis:', tags)
      setTagsQueryVal(tags)
    }"
    @tag-deleted="(tagId: string) => deletedTagHandler(tagId)"
  />

  <div class="my-2">
    <RadioGroup
      default-value="desc"
      v-model="orderQueryVal"
    >
      <div class="flex items-center space-x-2">
        <RadioGroupItem
          id="desc"
          value="desc"
        />
        <Label for="option-two">Descending</Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem
          id="asc"
          value="asc"
        />
        <Label for="option-one">Ascending</Label>
      </div>
    </RadioGroup>
  </div>

  <template v-for="(note) in notes">
    <NoteCard :note="note" />
  </template>
  <div class="flex flex-row items-center justify-evenly">
    <Button
      @click="onPrev()"
      class="my-2"
    >
      <ArrowLeft class="w-4 h-4 mr-2" /> Prev
    </Button>
    <Button
      @click="onNext()"
      class="my-2"
    >
      Next
      <ArrowRight class="w-4 h-4 mr-2" />
    </Button>
  </div>
  <Toaster />
</template>