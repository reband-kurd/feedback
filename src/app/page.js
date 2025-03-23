"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { submitFeedbackAction } from "@/actions/submitFeedbackAction";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format the phone number to include Iraqi country code
    const formattedPhone = phone.startsWith("7") ? `+964${phone}` : phone;

    try {
      const result = await submitFeedbackAction({
        name,
        phone: formattedPhone,
        feedback,
      });

      if (result.success) {
        toast.success("سوپاس بۆ ڕاوبۆچوونەكەت!", {
          description: "ڕاوبۆچوونەكەت بە سەركەوتوویی ناردرا.",
        });
        // Reset form
        setName("");
        setPhone("");
        setFeedback("");
      } else {
        throw new Error(result.error || "ناردنی ڕاوبۆچوونەكە سەركەوتوو نەبوو");
      }
    } catch (error) {
      toast.error("هەڵەیەك ڕوویدا", {
        description: error.message || "تكایە دواتر هەوڵ بدەرەوە.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            پلاتفۆڕمی فیدباك
          </h1>
          <p className="text-muted-foreground">
            ڕاوبۆچوونەكانتان گرنگن بۆ ئێمە
          </p>
        </div>

        <Card className="border rounded-lg shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-card-foreground">
              ڕاوبۆچوونەكانت بنێرە
            </CardTitle>
            <CardDescription className="text-center">
              یارمەتیمان بدە بۆ باشتركردنی خزمەتگوزارییەكانمان
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ناو</Label>
                <Input
                  id="name"
                  placeholder="ناوی خۆت بنووسە"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-background border-input"
                />
              </div>

              <div className="space-y-2 " dir="ltr">
                <Label htmlFor="phone">ژمارەی مۆبایل</Label>
                <div className="flex flex-row justify-end">
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setPhone(value);
                    }}
                    required
                    className="bg-background border-input pl-14 rtl:pl-3 rtl:pr-14"
                    maxLength={10}
                    pattern="^7[0-9]{9}$"
                    title="ژمارەی مۆبایلی عێراقی دەبێت بە 7 دەست پێبكات و 10 ژمارە بێت"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  بۆ نموونە: 7504679946
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">فیدباك</Label>
                <Textarea
                  id="feedback"
                  placeholder="ڕاوبۆچوونەكانت بنووسە..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  className="min-h-32 bg-background border-input resize-none"
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-primary mt-4 text-primary-foreground hover:bg-primary/90 rounded-md py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "دەنێردرێت..." : "ناردنی فیدباك"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>سوپاس بۆ هاوكاریت لە باشتركردنی خزمەتگوزارییەكانماندا</p>
        </div>
      </div>
    </main>
  );
}
