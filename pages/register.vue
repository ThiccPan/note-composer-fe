<script setup lang="ts">
definePageMeta({
  layout: false,
})
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'

import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
const { user, registerUser } = useFirebaseAuth()

const { toast } = useToast()

console.log("user:", user.value)

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(1),
}).required({
  email: true,
  username: true,
  password: true,
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  console.log(values)
  const success = await registerUser(values.email, values.username, values.password)
  if (!success) {
    toast({
      variant: "destructive",
      title: 'failed to register',
    });
    return
  }
  toast({
    variant: "default",
    title: 'register successfull',
  });
  navigateTo('/')
})
</script>

<template>
  <form
    class=""
    @submit="onSubmit"
  >
    <div class="flex flex-row min-h-screen justify-center items-center">
      <Card class="w-full max-w-sm">
        <CardHeader>
          <CardTitle class="text-2xl">
            Register new account
          </CardTitle>
          <CardDescription>
            Enter your email and password below to register a new account.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">

          <div class="grid gap-2">
            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    required
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid gap-2">
            <FormField
              v-slot="{ componentField }"
              name="username"
            >
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    type="username"
                    required
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid gap-2">
            <FormField
              v-slot="{ componentField }"
              name="password"
            >
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    required
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

        </CardContent>
        <CardFooter>
          <Button class="w-full">
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  </form>
  <Toaster />
</template>