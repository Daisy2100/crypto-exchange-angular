import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService } from '../../auth/auth-http.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { apiAuth } from '../../api/api-auth';

@Component({
    selector: 'app-login-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
    @Input() visible = false;
    @Output() close = new EventEmitter<boolean>();
    @Output() loginSuccess = new EventEmitter<{ username: string; token: string }>();

    form: FormGroup;
    loading = false;
    @Input() isLoginMode = true;
    cmdOutput: string[] = [
        'C:\\CryptoEx> auth',
        'Enter credentials to authenticate'
    ];

    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private auth: AuthHttpService,
        private apiService: ApiService) {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnChanges() {
        if (this.visible) {
            this.resetForm();
        }
    }

    async handleSubmit() {
        if (this.form.invalid) {
            this.addCmdOutput('Error: Username and password are required');
            return;
        }
        this.loading = true;
        const { username, password } = this.form.value;
        try {

            this.apiService.post(this.isLoginMode ? apiAuth.login() : apiAuth.register(), { username, password }).subscribe({
                next: (response: any) => {

                    console.log(response);

                    if (response.code === '0000000') {
                        if (this.isLoginMode) {
                            this.auth.setAuthData(response.data.token, username);
                            this.addCmdOutput('Login successful!');
                            this.addCmdOutput(`Welcome back, ${username}!`);
                            setTimeout(() => {
                                this.loginSuccess.emit({ username, token: response.data.token });
                                this.close.emit(true);
                            }, 500);
                        } else {
                            this.addCmdOutput('Registration successful!');
                            this.addCmdOutput(`User ID: ${response.data.user_id}`);
                            this.addCmdOutput('Please login with your credentials');
                            setTimeout(() => {
                                this.isLoginMode = true;
                                this.resetCmdOutput();
                            }, 500);
                        }
                    } else {
                        throw new Error(response.data.message || 'Authentication failed');
                    }
                    this.loading = false;
                },
                error: (err: any) => {
                    this.error = err?.error?.message || err.message || 'Network error occurred';
                    this.addCmdOutput(`Error: ${this.error}`);
                    this.loading = false;
                }
            });


        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error.message || 'Network error';
            this.addCmdOutput(`Error: ${errorMsg}`);
        } finally {
            this.loading = false;
        }
    }

    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        this.resetCmdOutput();
    }

    resetForm() {
        this.form.reset();
        this.loading = false;
        this.form.enable();
        this.resetCmdOutput();
    }

    resetCmdOutput() {
        this.cmdOutput = [
            'C:\\CryptoEx> auth',
            this.isLoginMode ? 'Enter credentials to authenticate' : 'Create new account'
        ];
    }

    addCmdOutput(message: string) {
        this.cmdOutput.push(`> ${message}`);
        if (this.cmdOutput.length > 8) {
            this.cmdOutput.shift();
        }
    }

    closeModal(flag: boolean) {
        this.close.emit(flag);
    }
}
