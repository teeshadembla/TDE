// templates/fellowProfileUpdateTemplate.js

export const fellowProfileUpdateTemplate = ({
  name,
  status,
}) => {
  return {
    subject: `Profile ${status} Update`,
    html: `
      <h2>Hello ${name},</h2>
      <p>Your fellow profile is currently in <strong>${status}</strong> state.</p>
      <p>You can continue editing it anytime.</p>
    `,
    text: `Hello ${name}, Your profile ${fellowProfileName} is in ${status} state.`,
  };
};