import { useState } from "react";

import { css } from "@emotion/react";
import { Button } from "@mui/material";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import * as yup from "yup";

import bffClient from "../clients/bffClient";
import Input from "../components/Input";
import useGame from "../hooks/useGame";
import { desktop, mobile } from "../styles/breakpoints";

interface FormModel {
  username: string;
}

const LoginPage = () => {
  const { setGame, username, setUsername } = useGame();
  const navigate = useNavigate();

  /*
   * This hook fixes a stupid Formik bug where the changing localStorage username will
   * temp rewrite the "*initial*Values" username, creating a very quick form error that
   * results in the input field going red because it's last resolved state was invalid
   * despite the fact that the user will never see the invalid state 🙄 Only happens on
   * existing games for new users
   */
  const [initialUsername] = useState(username ?? "");

  // TODO - implement this form flow
  const onNewGame = async ({ username }: FormModel) => {
    setUsername(username);
    const game = await bffClient.fetchGame();
    setGame(game);
    navigate(`/game/${username}/${game.id}`);
  };
  // TODO - implement this form flow
  const onExistingGame = ({ username }: FormModel) => {
    setUsername(username);
  };

  return (
    <div
      css={[
        css`
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        `,
        desktop(
          css`
            margin-left: 10%;
          `
        ),
      ]}
    >
      <Formik
        validateOnMount
        initialValues={{ username: initialUsername }}
        validationSchema={yup.object({
          username: yup.string().required(),
        })}
        onSubmit={form => onNewGame(form)}
      >
        {form => (
          <Form>
            <div
              css={[
                css`
                  display: flex;
                  align-items: center;
                  gap: 1em;
                `,
                mobile(
                  css`
                    flex-direction: column;
                  `
                ),
              ]}
            >
              <Input name="username" label="What's your name?" />
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 1em;
                `}
              >
                <Button type="submit" variant="contained">
                  Create a game
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  onClick={async () => {
                    // Fake out submission for this onClick secondary action
                    const valid =
                      Object.keys(await form.validateForm()).length === 0;
                    form.setFieldTouched("username");
                    if (valid) {
                      onExistingGame(form.values);
                    }
                  }}
                >
                  Join an existing game
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
