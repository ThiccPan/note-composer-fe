<script setup lang="ts">
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@/components/ui/tags-input'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger
} from 'radix-vue'
import { computed, ref } from 'vue'
import { deleteTagReq } from '~/repository/Tags';
import type { Tag } from '~/types/types';

const props = defineProps<{
  token: string
  tags: Tag[]
}>()

  const emit = defineEmits(['tag-selected', 'tag-deleted'])
const selectedTags = ref<string[]>([])
const open = ref(false)
const searchTerm = ref('')

const filteredTags = computed(() => {
  return props.tags.filter(i => !selectedTags.value.includes(i.id))
})

const addSelected = (tag: string) => {
  // if (selectedTags.value.length >= 1) {
  //   selectedTags.value.pop()
  //   console.log('popped')
  // }
  selectedTags.value.push(tag)
  emit('tag-selected', selectedTags.value)
}

const onDeleted = async (tag: string) => {
  // tags value fetched by api calls
  await deleteTagReq({ token: props.token, tag: tag })
    .catch((error) => {
      console.error(error)
    })
  console.log("tag deleted")
  emit('tag-deleted', selectedTags)
}
</script>

<template>
  <TagsInput
    class="px-0 gap-0 max-w-sm"
    :model-value="selectedTags"
  >
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem
        v-for="item in selectedTags"
        :key="item"
        :value="item"
      >
        <TagsInputItemText />
        <TagsInputItemDelete @click="$emit('tag-selected', selectedTags)" />
      </TagsInputItem>
    </div>

    <ComboboxRoot
      v-model="selectedTags"
      v-model:open="open"
      v-model:search-term="searchTerm"
      class="w-full"
    >
      <ComboboxAnchor
        as-child
        class="flex flex-col"
      >
        <ComboboxInput
          placeholder="tags..."
          as-child
        >
          <TagsInputInput
            class="w-full px-3"
            :class="selectedTags.length > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
            @click="open = !open"
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <div
                v-for="tag in filteredTags"
                :key="tag.id"
                class="flex flex-row"
              >
                <Button
                  @click="onDeleted(tag.id)"
                  class="my-auto"
                  variant="destructive"
                  size="xs"
                >delete</Button>
                <CommandItem
                  class="flex-auto"
                  :value="tag.id"
                  @select.prevent="(ev) => {
                    // add the tag to selected tags array and return the array to parents component
                    if (typeof ev.detail.value === 'string') {
                      searchTerm = ''
                      addSelected(ev.detail.value)
                      // selectedTags.push(ev.detail.value)
                      // $emit('tag-selected', selectedTags)
                    }

                    if (filteredTags.length === 0) {
                      open = false
                    }
                  }"
                >
                  {{ tag.id }}
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>