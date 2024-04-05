import { Shield } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy — Scallop</title>
      </Head>

      <main className="mx-auto flex min-h-[calc(100vh-53px)] max-w-[950px] flex-col space-y-10 p-6 sm:p-12">
        <section className="space-y-3">
          <h1 className="flex scroll-m-20 flex-col gap-1 text-3xl font-semibold tracking-tight">
            <Shield size={35} />
            Privacy policy
          </h1>
          <p>Last updated: February 23, 2024</p>
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>
          <p>
            We use Your Personal data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Interpretation and Definitions
          </h2>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Interpretation
            </h3>
            <p>
              The words of which the initial letter is capitalized have meanings
              defined under the following conditions. The following definitions
              shall have the same meaning regardless of whether they appear in
              singular or in plural.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Definitions
            </h3>
            <p>For the purposes of this Privacy Policy:</p>
            <ul className="list-disc space-y-1.5 pl-7">
              <li>
                <strong>Account</strong> means a unique account created for You
                to access our Service or parts of our Service.
              </li>
              <li>
                <strong>Company</strong> (referred to as either &quot;the
                Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;
                in this Agreement) refers to Scallop.
              </li>
              <li>
                <strong>Country</strong> refers to: Pennsylvania, United States
              </li>
              <li>
                <strong>Device</strong> means any device that can access the
                Service such as a computer, a cellphone or a digital tablet.
              </li>
              <li>
                <strong>Personal Data</strong> is any information that relates
                to an identified or identifiable individual.
              </li>
              <li>
                <strong>Service</strong> refers to the Website.
              </li>
              <li>
                <strong>Service Provider</strong> means any natural or legal
                person who processes the data on behalf of the Company. It
                refers to third-party companies or individuals employed by the
                Company to facilitate the Service, to provide the Service on
                behalf of the Company, to perform services related to the
                Service or to assist the Company in analyzing how the Service is
                used.
              </li>
              <li>
                <strong>Third-party OAuth Service</strong> refers to any website
                or any social network website through which a User can log in or
                create an account to use the Service.
              </li>
              <li>
                <strong>Usage Data</strong> refers to data collected
                automatically, either generated by the use of the Service or
                from the Service infrastructure itself (for example, the
                duration of a page visit).
              </li>
              <li>
                <strong>Website</strong> refers to Scallop, accessible from{" "}
                <Link
                  href="https://scallop.build"
                  className="font-medium hover:underline"
                  target="_blank"
                >
                  https://scallop.build
                </Link>
              </li>
              <li>
                <strong>You</strong> means the individual accessing or using the
                Service, or the company, or other legal entity on behalf of
                which such individual is accessing or using the Service, as
                applicable.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Collecting and Using Your Personal Data
          </h2>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Types of Data Collected
            </h3>

            <h4 className="font-bold">Personal Data</h4>
            <p>
              While using Our Service, We may ask You to provide Us with certain
              personally identifiable information that can be used to contact or
              identify You. Personally identifiable information may include, but
              is not limited to:
            </p>
            <ul className="list-disc space-y-1.5 pl-7">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Usage Data</li>
            </ul>

            <h4 className="font-bold">Usage Data</h4>
            <p>Usage Data is collected automatically when using the Service.</p>
            <p>
              Usage Data may include information such as Your Device&apos;s
              Internet Protocol address (e.g. IP address), browser type, browser
              version, the pages of our Service that You visit, the time and
              date of Your visit, the time spent on those pages, unique device
              identifiers and other diagnostic data.
            </p>
            <p>
              When You access the Service by or through a mobile device, We may
              collect certain information automatically, including, but not
              limited to, the type of mobile device You use, Your mobile device
              unique ID, the IP address of Your mobile device, Your mobile
              operating system, the type of mobile Internet browser You use,
              unique device identifiers and other diagnostic data.
            </p>
            <p>
              We may also collect information that Your browser sends whenever
              You visit our Service or when You access the Service by or through
              a mobile device.
            </p>

            <h4 className="font-bold">
              Information from Third-Party OAuth Services
            </h4>
            <p>
              The Company allows You to create an account and log in to use the
              Service through the following Third-party OAuth Services:
            </p>
            <ul className="list-disc space-y-1.5 pl-7">
              <li>GitHub</li>
              <li>Google</li>
            </ul>
            <p>
              If You decide to register through or otherwise grant us access to
              a Third-Party OAuth Service, We may collect Personal data that is
              already associated with Your Third-Party OAuth Service&apos;s
              account, such as Your name, Your email address, or Your profile
              picture associated with that account.
            </p>
            <p>
              You may also have the option of sharing additional information
              with the Company through Your Third-Party OAuth Service&apos;s
              account. If You choose to provide such information and Personal
              Data, during registration or otherwise, You are giving the Company
              permission to use, share, and store it in a manner consistent with
              this Privacy Policy.
            </p>

            <h4 className="font-bold">Google OAuth (Google LLC)</h4>
            <p>
              Google OAuth is a registration and authentication service provided
              by Google LLC and is connected to the Google network. Personal
              Data processed: various types of Data as specified in the privacy
              policy of the service.
            </p>
            <p>
              Place of processing: United States -{" "}
              <Link
                href="https://policies.google.com/privacy"
                className="font-medium hover:underline"
                target="_blank"
              >
                https://policies.google.com/privacy
              </Link>
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Use of Your Personal Data
            </h3>
            <p>The Company may use Personal Data for the following purposes:</p>
            <ul className="list-disc space-y-1.5 pl-7">
              <li>
                <strong>To provide and maintain our Service</strong>, including
                to monitor the usage of our Service.
              </li>
              <li>
                <strong>To manage Your Account:</strong> to manage Your
                registration as a user of the Service. The Personal Data You
                provide can give You access to different functionalities of the
                Service that are available to You as a registered user.
              </li>
              <li>
                <strong>To contact You:</strong> To contact You by email or
                other equivalent forms of electronic communication, regarding
                updates or informative communications related to the
                functionalities or products, including the security updates,
                when necessary or reasonable for their implementation.
              </li>
              <li>
                <strong>To manage Your requests:</strong> To attend and manage
                Your requests to Us.
              </li>
              <li>
                <strong>For other purposes</strong>: We may use Your information
                for other purposes, such as data analysis, identifying usage
                trends, determining the effectiveness of our promotional
                campaigns and to evaluate and improve our Service, products,
                services, marketing and your experience.
              </li>
            </ul>
            <p>
              We may share Your personal information in the following
              situations:
            </p>
            <ul className="list-disc space-y-1.5 pl-7">
              <li>
                <strong>With Service Providers:</strong> We may share Your
                personal information with Service Providers to monitor and
                analyze the use of our Service, to contact You.
              </li>
              <li>
                <strong>With other users:</strong> when You share personal
                information or otherwise interact in the public areas with other
                users, such information may be viewed by all users and may be
                publicly distributed outside. If You interact with other users
                or register through a Third-Party OAuth Service, other users may
                be able to view descriptions of Your activity, communicate with
                You and view Your profile.
              </li>
              <li>
                <strong>With Your consent</strong>: We may disclose Your
                personal information for any other purpose with Your consent.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Retention of Your Personal Data
            </h3>
            <p>
              The Company will retain Your Personal Data only for as long as is
              necessary for the purposes set out in this Privacy Policy. We will
              retain and use Your Personal Data to the extent necessary to
              comply with our legal obligations (for example, if we are required
              to retain your data to comply with applicable laws), resolve
              disputes, and enforce our legal agreements and policies.
            </p>
            <p>
              The Company will also retain Usage Data for internal analysis
              purposes. Usage Data is generally retained for a shorter period of
              time, except when this data is used to strengthen the security or
              to improve the functionality of Our Service, or We are legally
              obligated to retain this data for longer time periods.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Transfer of Your Personal Data
            </h3>
            <p>
              Your information, including Personal Data, is processed at the
              Company&apos;s operating offices and in any other places where the
              parties involved in the processing are located. It means that this
              information may be transferred to — and maintained on — computers
              located outside of Your state, province, country or other
              governmental jurisdiction where the data protection laws may
              differ than those from Your jurisdiction.
            </p>
            <p>
              Your consent to this Privacy Policy followed by Your submission of
              such information represents Your agreement to that transfer.
            </p>
            <p>
              The Company will take all steps reasonably necessary to ensure
              that Your data is treated securely and in accordance with this
              Privacy Policy and no transfer of Your Personal Data will take
              place to an organization or a country unless there are adequate
              controls in place including the security of Your data and other
              personal information.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Delete Your Personal Data
            </h3>
            <p>
              You have the right to delete or request that We assist in deleting
              the Personal Data that We have collected about You.
            </p>
            <p>
              Our Service may give You the ability to delete certain information
              about You from within the Service.
            </p>
            <p>
              You may update, amend, or delete Your information at any time by
              contacting Us to request access to, correct, or delete any
              personal information that You have provided to Us.
            </p>
            <p>
              Please note, however, that We may need to retain certain
              information when we have a legal obligation or lawful basis to do
              so.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Disclosure of Your Personal Data
            </h3>

            <h4 className="font-bold">Law enforcement</h4>
            <p>
              Under certain circumstances, the Company may be required to
              disclose Your Personal Data if required to do so by law or in
              response to valid requests by public authorities (e.g. a court or
              a government agency).
            </p>

            <h4 className="font-bold">Other legal requirements</h4>
            <p>
              The Company may disclose Your Personal Data in the good faith
              belief that such action is necessary to:
            </p>
            <ul className="list-disc space-y-1.5 pl-7">
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of the Company</li>
              <li>
                Prevent or investigate possible wrongdoing in connection with
                the Service
              </li>
              <li>
                Protect the personal safety of Users of the Service or the
                public
              </li>
              <li>Protect against legal liability</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Security of Your Personal Data
            </h3>
            <p>
              The security of Your Personal Data is important to Us, but
              remember that no method of transmission over the Internet, or
              method of electronic storage is 100% secure. While We strive to
              use commercially acceptable means to protect Your Personal Data,
              We cannot guarantee its absolute security.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Children&apos;s Privacy
          </h2>
          <p>
            Our Service does not address anyone under the age of 13. We do not
            knowingly collect personally identifiable information from anyone
            under the age of 13. If You are a parent or guardian and You are
            aware that Your child has provided Us with Personal Data, please
            contact Us. If We become aware that We have collected Personal Data
            from anyone under the age of 13 without verification of parental
            consent, We take steps to remove that information from Our servers.
          </p>
          <p>
            If We need to rely on consent as a legal basis for processing Your
            information and Your country requires consent from a parent, We may
            require Your parent&apos;s consent before We collect and use that
            information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Links to Other Websites
          </h2>
          <p>
            Our Service may contain links to other websites that are not
            operated by Us. If You click on a third party link, You will be
            directed to that third party&apos;s site. We strongly advise You to
            review the Privacy Policy of every site You visit.
          </p>
          <p>
            We have no control over and assume no responsibility for the
            content, privacy policies or practices of any third party sites or
            services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Changes to this Privacy Policy
          </h2>
          <p>
            We may update Our Privacy Policy from time to time. We will notify
            You of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>
            We will let You know via email and/or a prominent notice on Our
            Service, prior to the change becoming effective and update the
            &quot;Last updated&quot; date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, You can contact
            us:
          </p>
          <ul className="list-disc space-y-1.5 pl-7">
            <li>
              By email:{" "}
              <Link
                href="mailto:scallop-lang@seas.upenn.edu"
                className="font-medium hover:underline"
              >
                scallop-lang@seas.upenn.edu
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
};

export default PrivacyPolicy;