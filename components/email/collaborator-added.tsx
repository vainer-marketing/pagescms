import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { emailTheme } from "@/components/email/theme";
import { friendlyProjectName } from "@/lib/brand";

export const CollaboratorAddedEmailTemplate = ({
  email,
  repoName,
  repoUrl,
  invitedByName,
  invitedByUrl,
}: {
  email: string;
  repoName: string;
  repoUrl: string;
  invitedByName: string;
  invitedByUrl: string;
}) => {
  const baseUrl = process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "";
  const projectName = friendlyProjectName(repoName);

  return (
    <Html>
      <Head />
      <Preview>You now have access to {projectName}</Preview>
      <Tailwind>
        <Body
          className="my-auto mx-auto font-sans px-2 antialiased"
          style={{
            backgroundColor: emailTheme.background,
            color: emailTheme.foreground,
          }}
        >
          <Container className="my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section
              className="rounded-[12px] py-[28px] text-center"
              style={{ backgroundColor: emailTheme.headerBackground }}
            >
              <Img
                src={`${baseUrl}/images/email-logo.png`}
                width="150"
                height="38"
                alt="Vainer Marketing"
                className="my-0 mx-auto"
                style={{ objectFit: "contain" }}
              />
            </Section>
            <Heading
              className="text-[24px] font-semibold p-0 my-[30px] mx-0 text-center tracking-tight"
              style={{ color: emailTheme.foreground }}
            >
              You now have access to {projectName}
            </Heading>
            <Text
              className="text-[16px] leading-[24px]"
              style={{ color: emailTheme.foreground }}
            >
              <Link
                href={invitedByUrl}
                className="underline rounded-md"
                style={{ color: emailTheme.link }}
              >
                {invitedByName}
              </Link>{" "}
              gave you access to edit <strong>{projectName}</strong>. You&apos;re
              all set — there&apos;s nothing to accept.
            </Text>
            <Section className="text-center mt-[24px] mb-[24px]">
              <Button
                className="rounded-lg text-[14px] font-medium no-underline text-center px-5 py-3"
                href={repoUrl}
                style={{
                  backgroundColor: emailTheme.buttonBackground,
                  border: `1px solid ${emailTheme.buttonBorder}`,
                  color: emailTheme.buttonForeground,
                }}
              >
                Open {projectName}
              </Button>
            </Section>
            <Text
              className="text-[14px] leading-[24px] mt-[36px]"
              style={{ color: emailTheme.mutedForeground }}
            >
              This email was intended for{" "}
              <Link
                href={`mailto:${email}`}
                className="underline"
                style={{ color: emailTheme.mutedLink }}
              >
                {email}
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
