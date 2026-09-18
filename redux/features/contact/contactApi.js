import { apiSlice } from "@/redux/api/apiSlice";

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitInquiry: builder.mutation({
      query: (body) => ({
        url: "api/contact/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubmitInquiryMutation } = contactApi;
