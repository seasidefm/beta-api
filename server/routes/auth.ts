import express from "express";
import { CredentialsPayload } from "../services/storage/User";
import { AuthService } from "../services/AuthService";

const router = express.Router();

interface LoginPayload {
    user: string;
    credentials: CredentialsPayload & { expires_in?: number };
}

const authService = new AuthService();

router.post("/login", async (req, res) => {
    const data: LoginPayload = req.body;

    delete data.credentials.expires_in;

    const token = await authService.loginUser(data.user, data.credentials);

    res.cookie("token", token, {
        httpOnly: true,
    });
    res.send("OK");
});

export default router;
