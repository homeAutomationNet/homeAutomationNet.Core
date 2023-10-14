export async function showModalDialog(text: string, title: string, dialogType: 'ok' | 'okCancel' | 'retryCancel' | 'yesNo' | 'yesNoCancel' = 'ok'): Promise<boolean | null> {
    return true;
}

export async function showModalInputBox(): Promise<string | null> {
    return null;
}