<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import type { AuthResponse } from "~/types/auth";

type LoginType = {
  email: string;
  password: string;
};

const auth = useAuthentication();
const router = useRouter();
const refForm = ref<FormInstance>();
const isLoading = ref(false);
const showPassword = ref(false);
const errorMessage = ref("");

const information = reactive<LoginType>({
  email: "",
  password: "",
});

async function handleLogin() {
  if (!refForm.value || isLoading.value) return;

  errorMessage.value = "";
  isLoading.value = true;

  try {
    // Validate form
    const isValid = await new Promise<boolean>((resolve) => {
      refForm.value?.validate((valid) => {
        resolve(valid);
      });
    });

    if (!isValid) {
      isLoading.value = false;
      return;
    }

    // Make API call
    const response = await $fetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: {
        ...information,
      },
    });

    useLogin(response.userInfo, response.accessToken);

    if (auth.value.isLogin) {
      await router.push("/");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    errorMessage.value =
      error?.data?.message || "Invalid email or password. Please try again.";
  } finally {
    isLoading.value = false;
  }
}

async function changeMethod() {
  return router.push({ name: "auth-method", params: { method: "register" } });
}

// Enhanced validation rules
const rules = reactive<FormRules>({
  email: [
    { required: true, message: "Email is required", trigger: "blur" },
    {
      type: "email",
      message: "Please enter a valid email address",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    { required: true, message: "Password is required", trigger: "blur" },
    {
      min: 6,
      message: "Password must be at least 6 characters long",
      trigger: ["blur", "change"],
    },
  ],
});

// Toggle password visibility
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
</script>
<template lang="html">
  <div
    class="bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center px-4 py-8 w-full rounded-xl"
  >
    <div class="w-full max-w-6xl flex items-center justify-between">
      <!-- Left Side - Illustration -->
      <div class="hidden lg:flex flex-1 items-center justify-center relative">
        <!-- Geometric Shapes -->
        <div
          class="absolute top-10 left-10 w-4 h-4 bg-cyan-400 rounded-full"
        ></div>
        <div
          class="absolute top-20 right-20 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-green-400"
        ></div>
        <div
          class="absolute bottom-20 left-20 w-6 h-6 bg-yellow-400 transform rotate-45"
        ></div>
        <div
          class="absolute bottom-10 right-10 w-4 h-4 bg-blue-400 rounded-full"
        ></div>

        <!-- Main Laptop Illustration -->
        <div class="relative">
          <!-- Laptop Base -->
          <div class="w-80 h-6 bg-gray-300 rounded-lg shadow-lg"></div>

          <!-- Laptop Screen -->
          <div
            class="w-72 h-48 bg-gray-700 rounded-t-lg mx-auto -mt-1 relative overflow-hidden"
          >
            <!-- Screen Content -->
            <div
              class="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center"
            >
              <div
                class="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center"
              >
                <Icon
                  name="material-symbols:person"
                  class="w-12 h-12 text-gray-300"
                />
              </div>
            </div>

            <!-- Screen Reflection -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
            ></div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="flex-1 max-w-md mx-auto lg:mx-0">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Login</h1>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
        >
          <Icon
            name="material-symbols:error-outline"
            class="w-5 h-5 text-red-500 flex-shrink-0"
          />
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Login Form -->
        <el-form
          ref="refForm"
          :rules="rules"
          :model="information"
          class="space-y-6"
        >
          <!-- Email Field -->
          <el-form-item prop="email">
            <div class="relative w-full">
              <Icon
                name="material-symbols:mail-outline"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
              />
              <input
                v-model="information.email"
                type="email"
                placeholder="Email"
                class="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-200"
              />
            </div>
          </el-form-item>

          <!-- Password Field -->
          <el-form-item prop="password">
            <div class="relative w-full flex">
              <Icon
                name="material-symbols:lock-outline"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
              />
              <input
                v-model="information.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                class="w-full pl-12 pr-12 py-4 bg-gray-100 border-none rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-200"
              />
              <Icon
                @click="togglePasswordVisibility"
                :name="
                  showPassword
                    ? 'material-symbols:visibility-off-outline'
                    : 'material-symbols:visibility-outline'
                "
                class="cursor-pointer w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              />
            </div>
          </el-form-item>

          <!-- Login Button -->
          <button
            @click="handleLogin"
            :disabled="isLoading"
            type="button"
            class="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">LOGIN</span>
            <span v-else class="flex items-center justify-center space-x-2">
              <Icon
                name="material-symbols:refresh"
                class="w-5 h-5 animate-spin"
              />
              <span>LOGGING IN...</span>
            </span>
          </button>
        </el-form>

        <!-- Forgot Password -->
        <div class="text-center mt-6">
          <button
            type="button"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Forgot Username / Password?
          </button>
        </div>

        <!-- Create Account Link -->
        <div class="text-center mt-12">
          <button
            @click="changeMethod"
            type="button"
            class="text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2 mx-auto"
          >
            <span>Create your Account</span>
            <Icon name="material-symbols:arrow-forward" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang=""></style>
