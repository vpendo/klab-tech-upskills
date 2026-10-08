export const welcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to PendoHub</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f7f4ef;
  font-family: Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 18px;
            overflow: hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td style="
              background-color: #171717;
              padding: 42px 32px;
              text-align: center;
            ">

              <div style="
                display: inline-block;
                background-color: #f47b20;
                color: #ffffff;
                padding: 9px 18px;
                border-radius: 24px;
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 1.5px;
              ">
                PENDOHUB
              </div>

              <h1 style="
                margin: 24px 0 10px;
                color: #ffffff;
                font-size: 30px;
              ">
                Welcome, ${name}
              </h1>

              <p style="
                margin: 0;
                color: #d6d3d1;
                font-size: 15px;
              ">
                Your style starts here.
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="
              padding: 38px 32px;
              color: #292524;
              font-size: 15px;
              line-height: 1.7;
            ">

              <p style="margin: 0 0 18px;">
                Hi <strong>${name}</strong>,
              </p>

              <p style="margin: 0 0 28px;">
                Welcome to PendoHub. Your account is ready, and
                your next find could be just a few clicks away.
              </p>

              <!-- Categories -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>

                  <td style="
                    width: 50%;
                    padding: 20px;
                    background-color: #fff4e8;
                    border-radius: 12px;
                    vertical-align: top;
                  ">

                    <strong style="
                      color: #c65d0e;
                      font-size: 16px;
                    ">
                      SHOES
                    </strong>

                    <p style="
                      margin: 8px 0 0;
                      color: #57534e;
                      font-size: 13px;
                    ">
                      Find your next favorite pair.
                    </p>

                  </td>

                  <td style="width: 12px;"></td>

                  <td style="
                    width: 50%;
                    padding: 20px;
                    background-color: #f5f5f4;
                    border-radius: 12px;
                    vertical-align: top;
                  ">

                    <strong style="
                      color: #292524;
                      font-size: 16px;
                    ">
                      CLOTHING
                    </strong>

                    <p style="
                      margin: 8px 0 0;
                      color: #57534e;
                      font-size: 13px;
                    ">
                      Discover pieces made for your style.
                    </p>

                  </td>

                </tr>
              </table>

              <p style="
                margin: 0 0 8px;
                font-weight: bold;
                color: #171717;
                font-size: 17px;
              ">
                You're ready to shop.
              </p>

              <p style="margin: 0;">
                Log in anytime and explore what PendoHub has to offer.
              </p>

              <p style="
                margin: 28px 0 0;
                color: #57534e;
              ">
                Happy shopping,<br />
                <strong style="color: #f47b20;">
                  PendoHub Team
                </strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background-color: #171717;
              padding: 22px 32px;
              text-align: center;
              color: #a8a29e;
              font-size: 12px;
              line-height: 1.5;
            ">

              <p style="margin: 0 0 6px;">
                Didn't create this account? You can safely ignore this email.
              </p>

              <p style="margin: 0;">
                &copy; ${new Date().getFullYear()} PendoHub. All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;