"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import ChaptersList from "./chapter-list";
type ChapterFormProps = {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
};

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});
const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const toggleCreating = () => setIsCreating((current) => !current);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter created");
      toggleCreating();
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const onReorder = async (updatedData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updatedData,
      });
      toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4">
      {isUpdating && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-md bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button onClick={toggleCreating} variant={"ghost"}>
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name={"title"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.chapters.length && "italic text-slate-500",
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          <ChaptersList
            onEdit={() => {}}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="mt-4 text-sm text-muted-foreground">
          Darg and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};

export default ChapterForm;
