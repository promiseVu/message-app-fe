<script lang="ts" setup>
type Info = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const initialInfo: Info = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
};
definePageMeta({
  requireAuth: false,
});
const auth = useAuthentication()
const router = useRouter()
const infomation = reactive<Info>({ ...initialInfo });
const formState = ref<"login" | "register">("login");
async function handleLogin() {
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: infomation.email,
        password: infomation.password,
      },
    });
    useLogin(response.userInfo, response.accessToken)
    if(auth.value.isLogin){
      router.push('/')
    }
  } catch (error) {
    console.error("Lỗi khi gọi api", error);
  }
}

function handleRegister() {
  console.log("infomation login", infomation);
}

function changeForm() {
  formState.value = formState.value === "login" ? "register" : "login";
}
</script>
<template lang="html">
  <div class="h-full">
    <div class="flex items-center justify-center h-full">
      <el-form :model="infomation" class="w-96 shadow-xl p-10">
        <div class="flex justify-center text-3xl mb-5 font-bold">
          {{ formState === "register" ? "REGISTER" : "LOGIN" }}
        </div>
        <el-form-item label="Email">
          <el-input
            v-model="infomation.email"
            placeholder="huy.developer@gmail.com"
            clearable
          />
        </el-form-item>

        <el-form-item v-if="formState === 'register'" label="First Name">
          <el-input
            v-model="infomation.firstName"
            placeholder="Vu Quoc"
            clearable
          />
        </el-form-item>
        <el-form-item label="Last Name" v-if="formState === 'register'">
          <el-input v-model="infomation.lastName" placeholder="Huy" clearable />
        </el-form-item>

        <el-form-item label="Password">
          <el-input
            v-model="infomation.password"
            placeholder="Please enter password"
            type="password"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="formState === 'register'" label="Password Confirm">
          <el-input
            v-model="infomation.confirmPassword"
            type="password"
            placeholder="Confirm password"
            clearable
          />
        </el-form-item>
        <div class="flex justify-end">
          <span
            @click="changeForm"
            class="mb-4 text-xs hover:underline hover:cursor-pointer opacity-50"
            >{{
              formState === "register"
                ? "Already have an account"
                : "Don't have an account?"
            }}</span
          >
        </div>
        <div class="flex justify-end">
          <el-button
            v-if="formState === 'register'"
            type="warning"
            @click="handleRegister"
            >Register</el-button
          >
          <el-button v-else type="success" @click="handleLogin"
            >Login</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang=""></style>
