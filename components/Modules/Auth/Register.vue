<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
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
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Password strength calculation
const passwordStrength = computed(() => {
  const password = information.password;
  if (!password) return { score: 0, text: "", color: "" };

  let score = 0;
  let feedback = [];

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push("at least 8 characters");

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("uppercase letter");

  // Lowercase check
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("lowercase letter");

  // Number check
  if (/\d/.test(password)) score += 1;
  else feedback.push("number");

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push("special character");

  const strengthLevels = [
    { score: 0, text: "Very Weak", color: "text-red-500" },
    { score: 1, text: "Weak", color: "text-red-400" },
    { score: 2, text: "Fair", color: "text-yellow-500" },
    { score: 3, text: "Good", color: "text-blue-500" },
    { score: 4, text: "Strong", color: "text-green-500" },
    { score: 5, text: "Very Strong", color: "text-green-600" },
  ];

  return {
    score,
    text: strengthLevels[score].text,
    color: strengthLevels[score].color,
    feedback: feedback.slice(0, 2), // Show only first 2 suggestions
  };
});

async function handleRegister() {
  if (!refForm.value || isLoading.value) return;

  errorMessage.value = "";
  successMessage.value = "";
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
    const { confirmPassword, ...data } = information;
    const response = await $fetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: data,
    });

    successMessage.value = "Account created successfully! Redirecting...";

    // Auto login after successful registration
    useLogin(response.userInfo, response.accessToken);

    if (auth.value.isLogin) {
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    errorMessage.value =
      error?.data?.message || "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
}

async function changeMethod() {
  return router.push({ name: "auth-method", params: { method: "login" } });
}

// Enhanced validation rules
const rules = reactive<FormRules>({
  firstName: [
    { required: true, message: "First name is required", trigger: "blur" },
    {
      min: 2,
      message: "First name must be at least 2 characters long",
      trigger: ["blur", "change"],
    },
  ],
  lastName: [
    { required: true, message: "Last name is required", trigger: "blur" },
    {
      min: 2,
      message: "Last name must be at least 2 characters long",
      trigger: ["blur", "change"],
    },
  ],
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
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value && passwordStrength.value.score < 3) {
          callback(
            new Error(
              "Password is too weak. Please choose a stronger password."
            )
          );
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "Please confirm your password",
      trigger: "blur",
    },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== information.password) {
          callback(new Error("Passwords do not match"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
});

// Toggle password visibility
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value;
}
</script>
<template lang="html">
  <div
    class="bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 py-8 w-full rounded-xl"
  >
    <div class="w-full max-w-6xl flex items-center justify-between">
      <!-- Left Side - Illustration -->
      <div class="hidden lg:flex flex-1 items-center justify-center relative">
        <!-- Geometric Shapes -->
        <div
          class="absolute top-10 left-10 w-4 h-4 bg-purple-400 rounded-full"
        ></div>
        <div
          class="absolute top-20 right-20 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-400"
        ></div>
        <div
          class="absolute bottom-20 left-20 w-6 h-6 bg-green-400 transform rotate-45"
        ></div>
        <div
          class="absolute bottom-10 right-10 w-4 h-4 bg-cyan-400 rounded-full"
        ></div>

        <!-- Main Illustration - User Creation -->
        <div class="relative">
          <!-- Background Circle -->
          <div
            class="w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center"
          >
            <!-- User Icon -->
            <div
              class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <Icon
                name="material-symbols:person-add"
                class="w-16 h-16 text-gray-600"
              />
            </div>
          </div>

          <!-- Floating Elements -->
          <div
            class="absolute -top-4 -right-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center"
          >
            <Icon name="material-symbols:check" class="w-6 h-6 text-white" />
          </div>
          <div
            class="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center"
          >
            <Icon name="material-symbols:mail" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Right Side - Register Form -->
      <div class="flex-1 max-w-md mx-auto lg:mx-0">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p class="text-gray-600">Join us and start your journey</p>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3"
        >
          <Icon
            name="material-symbols:check-circle-outline"
            class="w-5 h-5 text-green-500 flex-shrink-0"
          />
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
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

        <!-- Register Form -->
        <el-form ref="refForm" :rules="rules" :model="information" class="">
          <!-- Name Fields Row -->
          <div class="flex gap-x-4 h-full">
            <!-- First Name -->
            <el-form-item prop="firstName">
              <div class="relative">
                <Icon
                  name="material-symbols:person-outline"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
                />
                <input
                  v-model="information.firstName"
                  type="text"
                  placeholder="First Name"
                  class="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-200"
                />
              </div>
            </el-form-item>

            <!-- Last Name -->
            <el-form-item prop="lastName">
              <div class="relative">
                <Icon
                  name="material-symbols:person-outline"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
                />
                <input
                  v-model="information.lastName"
                  type="text"
                  placeholder="Last Name"
                  class="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-200"
                />
              </div>
            </el-form-item>
          </div>

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
            <div class="relative w-full">
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

            <!-- Password Strength Indicator -->
            <div v-if="information.password" class="mt-2 px-4">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-600">Password Strength:</span>
                <span
                  :class="passwordStrength.color"
                  class="text-xs font-medium"
                >
                  {{ passwordStrength.text }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1">
                <div
                  class="h-1 rounded-full transition-all duration-300"
                  :class="{
                    'bg-red-500': passwordStrength.score <= 1,
                    'bg-yellow-500': passwordStrength.score === 2,
                    'bg-blue-500': passwordStrength.score === 3,
                    'bg-green-500': passwordStrength.score >= 4,
                  }"
                  :style="{ width: `${(passwordStrength.score / 5) * 100}%` }"
                ></div>
              </div>
            </div>
          </el-form-item>

          <!-- Confirm Password Field -->
          <el-form-item prop="confirmPassword">
            <div class="relative w-full">
              <Icon
                name="mdi:lock-check-outline"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
              />
              <input
                v-model="information.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm Password"
                class="w-full pl-12 pr-12 py-4 bg-gray-100 border-none rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-200"
              />
              <Icon
                @click="toggleConfirmPasswordVisibility"
                :name="
                  showPassword
                    ? 'material-symbols:visibility-off-outline'
                    : 'material-symbols:visibility-outline'
                "
                class="cursor-pointer w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              />
            </div>

            <!-- Password Match Indicator -->
            <div v-if="information.confirmPassword" class="mt-2 px-4">
              <div class="flex items-center space-x-2">
                <Icon
                  :name="
                    information.password === information.confirmPassword
                      ? 'material-symbols:check-circle'
                      : 'material-symbols:cancel'
                  "
                  :class="
                    information.password === information.confirmPassword
                      ? 'text-green-500'
                      : 'text-red-500'
                  "
                  class="w-4 h-4"
                />
                <span
                  :class="
                    information.password === information.confirmPassword
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                  class="text-xs"
                >
                  {{
                    information.password === information.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"
                  }}
                </span>
              </div>
            </div>
          </el-form-item>

          <!-- Register Button -->
          <button
            @click="handleRegister"
            :disabled="isLoading"
            type="button"
            class="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">CREATE ACCOUNT</span>
            <span v-else class="flex items-center justify-center space-x-2">
              <Icon
                name="material-symbols:refresh"
                class="w-5 h-5 animate-spin"
              />
              <span>CREATING ACCOUNT...</span>
            </span>
          </button>
        </el-form>

        <!-- Login Link -->
        <div class="text-center mt-12">
          <button
            @click="changeMethod"
            type="button"
            class="text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Icon name="material-symbols:arrow-back" class="w-4 h-4" />
            <span>Already have an account</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang=""></style>
