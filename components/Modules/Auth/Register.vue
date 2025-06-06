<script lang="ts" setup>
import type { ElForm, FormInstance, FormRules } from "element-plus";
import type { AuthResponse, RegisterType } from "~/types/auth";

const initialInfo: RegisterType = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
};

const auth = useAuthentication();
const router = useRouter();
const information = reactive<RegisterType>({ ...initialInfo });
const refForm = ref<FormInstance>();
async function handleRegister() {
  if (!refForm.value) return;
  const valid = await new Promise<boolean>((resolve) => {
    refForm.value!.validate((valid, fields) => {
      resolve(valid);
    });
  });

  if (valid) {
    try {
      const { confirmPassword, ...data } = information;
      const response = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: data,
      });

      useLogin(response.userInfo, response.accessToken);
      if (auth.value.isLogin) {
        await router.push("/");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  }
}

async function changeMethod() {
  return router.push({ name: "auth-method", params: { method: "login" } });
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
  firstName: [
    {
      required: true,
      message: "Vui lòng nhập họ",
      trigger: ["blur", "change"],
    },
  ],
  lastName: [
    {
      required: true,
      message: "Vui lòng nhập tên",
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
  confirmPassword: [
    { required: true, message: "Vui lòng xác nhận mật khẩu", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== information.password) {
          callback(new Error("Mật khẩu xác nhận không khớp"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
});
</script>
<template lang="html">
  <el-form
    ref="refForm"
    :rules="rules"
    :model="information"
    class="w-96 shadow-xl p-10"
  >
    <div class="flex justify-center text-3xl mb-5 font-bold">REGISTER</div>
    <el-form-item label="Email" prop="email">
      <el-input
        v-model="information.email"
        placeholder="huy.developer@gmail.com"
        clearable
      />
    </el-form-item>

    <el-form-item label="First Name" prop="firstName">
      <el-input
        v-model="information.firstName"
        placeholder="Vu Quoc"
        clearable
      />
    </el-form-item>
    <el-form-item label="Last Name" prop="lastName">
      <el-input v-model="information.lastName" placeholder="Huy" clearable />
    </el-form-item>

    <el-form-item label="Password" prop="password">
      <el-input
        v-model="information.password"
        placeholder="Please enter password"
        type="password"
        clearable
      />
    </el-form-item>
    <el-form-item label="Password Confirm" prop="confirmPassword">
      <el-input
        v-model="information.confirmPassword"
        type="password"
        placeholder="Confirm password"
        clearable
      />
    </el-form-item>
    <div @click="changeMethod" class="flex justify-end">
      <span class="mb-4 text-xs hover:underline hover:cursor-pointer opacity-50"
        >Already have an account</span
      >
    </div>
    <div class="flex justify-end">
      <el-button type="warning" @click="handleRegister">Register</el-button>
    </div>
  </el-form>
</template>

<style lang=""></style>
