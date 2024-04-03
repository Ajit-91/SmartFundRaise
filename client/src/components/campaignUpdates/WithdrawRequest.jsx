import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { FormField } from ".."
import { checkIfValidUrl } from "@/utils"
import { useStateContext } from "@/context"
import { Button } from "../ui/button"

export function WithdrawRequest({ isLastestUpdate }) {
    const {createWithdrawRequest} = useStateContext()
    const [form, setForm] = useState({
        amount: "",
        description: "",
        docLink: "",
    })

    const handleChange = (e, fieldName) => {
        setForm({ ...form, [fieldName]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { amount, description, docLink } = form
        if (!amount || !description) return alert("amount and description are mandatory fields")
        if(docLink && !checkIfValidUrl(docLink)) return alert("Please provide a valid document link")
        await createWithdrawRequest(amount, description, docLink)
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="w-full">
                <Button 
                    disabled={!isLastestUpdate} 
                    className="bg-custom-primary w-full hover:bg-custom-primary-dark text-white"
                >
                    Create Withdrawl Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Withdraw Request</DialogTitle>
                        <DialogDescription>
                            Tip for owner : Often high amount withdrawl requests are rejected. Believe in partial fund withdraw. Start from small amount
                        </DialogDescription>
                    </DialogHeader>
                    <br/>
                    <FormField
                        labelName="Amount *"
                        placeholder="ETH 0.50"
                        inputType="text"
                        value={form.amount}
                        handleChange={(e) => handleChange(e, 'amount')}
                    />
                    <br/>
                    <FormField
                        labelName="Description *"
                        placeholder="Write description here specifying needs and other related information"
                        isTextArea
                        value={form.description}
                        handleChange={(e) => handleChange(e, "description")}
                    />
                    <br/>
                    <FormField
                        labelName="Document Link"
                        placeholder="https://exampleDocumentLink.com"
                        inputType="text"
                        value={form.docLink}
                        required={false}
                        handleChange={(e) => handleChange(e, 'docLink')}
                    />
                    <br/>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="bg-custom-primary hover:bg-custom-primary-dark text-white"
                        >
                            Submit Request
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
