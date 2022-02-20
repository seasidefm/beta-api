import express from "express";
import { CredentialsPayload } from "../services/storage/User";
import { AuthService } from "../services/AuthService";
import Cookies from "cookies";

const router = express.Router();

interface TwitchCredentialsPayload {
    user: string;
    credentials: CredentialsPayload & { expires_in?: number };
}

interface LoginPayload {
    twitch?: TwitchCredentialsPayload;
}

const authService = new AuthService();

router.post("/login", async (req, res) => {
    const data: LoginPayload = req.body;

    if (data.twitch) {
        const payload = data.twitch;
        delete payload.credentials.expires_in;

        const token = await authService.loginUser(
            data.twitch.user,
            data.twitch.credentials
        );

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 900000),
        });
    }

    res.send("OK");
});

router.get("/user", async (req, res) => {
    const cookies = Cookies(req, res);
    const token = cookies.get("token");

    if (!token) {
        return res.status(403).send("You must have a token cookie");
    }

    const userData = await authService.getUserInfo(token);

    res.json({ ...userData });
});

export default router;
