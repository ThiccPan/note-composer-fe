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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'

import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const { loginUser } = useFirebaseAuth()
const { toast } = useToast()

const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(1),
}).required({
  email: true,
  password: true,
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  console.log(values)
  await loginUser(values.email, values.password)
    .catch((error) => {
      toast({
        variant: "destructive",
        title: 'failed to login',
        description: error,
      });
    })
  console.log('login success')
  return navigateTo('/')
})
</script>

<template>
  <div class="flex flex-row min-h-screen justify-center items-center">
    <Card class="w-full max-w-sm">
      <form
        class=""
        @submit="onSubmit"
      >
        <CardHeader>
          <CardTitle class="text-2xl">
            Login
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
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
      </form>
      <CardFooter>
        <Button @click="navigateTo('/register')" class="w-full">
          Register
        </Button>
      </CardFooter>
    </Card>
  </div>
  <Toaster />
</template>