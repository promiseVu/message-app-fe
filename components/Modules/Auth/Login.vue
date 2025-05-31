<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { el } from "element-plus/es/locale/index.mjs";
import type { AuthResponse } from "~/types/auth";

type LoginType = {
  email: string;
  password: string;
};

const auth = useAuthentication();
const router = useRouter();
const refForm = ref<FormInstance>();
const infomation = reactive<LoginType>({
  email: "",
  password: "",
});
async function handleLogin() {
  if (!refForm.value) return;

  // Bọc validate trong một Promise
  const isValid = await new Promise((resolve) => {
    refForm.value?.validate((valid, errors) => {
      if (!valid) {
        resolve(false); // Form không hợp lệ
      } else {
        resolve(true); // Form hợp lệ
      }
    });
  });

  // Chỉ gọi API nếu form hợp lệ
  if (!isValid) return;

  try {
    const response = await $fetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: {
        ...infomation,
      },
    });
    useLogin(response.userInfo, response.accessToken);
    if (auth.value.isLogin) {
      router.push("/");
    }
  } catch (error) {
    console.error("Lỗi khi gọi api", error);
  }
}

async function changeMethod() {
  return router.push({ name: "auth-method", params: { method: "register" } });
}

const rules = reactive<FormRules>({
  email: [
    { required: true, message: "Vui lòng nhập email", trigger: "blur" },
    {
      type: "email",
      message: "Email không hợp lệ",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: "blur" },
    {
      min: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
      trigger: ["blur", "change"],
    },
  ],
});
</script>
<template lang="html">
  <el-form
    ref="refForm"
    :rules="rules"
    :model="infomation"
    class="w-96 shadow-xl p-10"
  >
    <div class="flex justify-center text-3xl mb-5 font-bold">LOGIN</div>
    <el-form-item label="Email" prop="email">
      <el-input
        v-model="infomation.email"
        placeholder="huy.developer@gmail.com"
        clearable
      />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input
        v-model="infomation.password"
        placeholder="Please enter password"
        type="password"
        clearable
      />
    </el-form-item>
    <div @click="changeMethod" class="flex justify-end">
      <span class="mb-4 text-xs hover:underline hover:cursor-pointer opacity-50"
        >Don't have an account?</span
      >
    </div>
    <div class="flex justify-end">
      <el-button type="success" @click="handleLogin">Login</el-button>
    </div>
  </el-form>
</template>

<style lang=""></style>
