import { createSlice } from "@reduxjs/toolkit";
import { NotificationProps } from "../../types/notifications";

export type ReduxNotification = {
  id?: string;
  message: string;
  /** richMessages support any message contain rich text as an optional type */
  messages?: string[];
  props: Pick<NotificationProps, "type"> & Partial<NotificationProps>;
};

export type NotificationsInitialState = {
  notifications: Required<ReduxNotification>[];
};

const initialState: NotificationsInitialState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, { payload }: { payload: ReduxNotification }) => {
      if (
        payload.id &&
        state.notifications.find(
          (notification) => notification.id === payload.id
        )
      ) {
        console.log("teste");
        return;
      }
      console.log("teste");

      state.notifications.push({
        id: payload.id !== undefined ? payload.id : crypto.randomUUID(),
        message: payload.message,
        messages: payload.messages ?? [],
        props: {
          ...payload.props,
          hasTimeout:
            /** By default, success notification has timeout */
            payload.props.hasTimeout !== undefined
              ? payload.props.hasTimeout
              : payload.props.type === "success",
        },
      });
    },
    removeNotification: (
      state,
      { payload: idToRemove }: { payload: string }
    ) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== idToRemove
      );
    },
    removeAllNotifications: () => initialState,
  },
});

export const { addNotification, removeNotification, removeAllNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
