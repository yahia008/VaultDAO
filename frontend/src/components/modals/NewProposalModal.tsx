import React, { useState, useEffect, useCallback } from 'react';
import { useVaultContract } from '../../hooks/useVaultContract';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export interface NewProposalFormData {
  recipient: string;
  token: string;
  amount: string;
  memo: string;
}

interface NewProposalModalProps {
  isOpen: boolean;
  loading: boolean;
  selectedTemplateName: string | null;
  formData: NewProposalFormData;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onFieldChange: (field: keyof NewProposalFormData, value: string) => void;
  onOpenTemplateSelector: () => void;
  onSaveAsTemplate: () => void;
  submitError?: string | null;
}

// Validation status indicator component
const ValidationIndicator: React.FC<{ status: 'valid' | 'invalid' | 'empty' | 'pending' }> = ({ status }) => {
  if (status === 'empty') return null;

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      {status === 'valid' && (
        <CheckCircle2 className="h-5 w-5 text-green-500" aria-label="Valid" />
      )}
      {status === 'invalid' && (
        <AlertCircle className="h-5 w-5 text-red-500" aria-label="Invalid" />
      )}
      {status === 'pending' && (
        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" aria-label="Checking..." />
      )}
    </div>
  );
};

const NewProposalModal: React.FC<NewProposalModalProps> = ({
  isOpen,
  loading,
  selectedTemplateName,
  formData,
  onClose,
  onSubmit,
  onFieldChange,
  onOpenTemplateSelector,
  onSaveAsTemplate,
  submitError,
}) => {
  const { getListMode, isWhitelisted, isBlacklisted } = useVaultContract();
  const [recipientError, setRecipientError] = useState<string | null>(null);
  const [listMode, setListMode] = useState<string>('Disabled');

  const loadListMode = useCallback(async () => {
    try {
      const mode = await getListMode();
      setListMode(mode);
    } catch (error) {
      console.error('Failed to load list mode:', error);
    }
  }, [getListMode]);

  const validateRecipient = useCallback(async () => {
    if (!formData.recipient) {
      setRecipientError(null);
      return;
    }

    try {
      if (listMode === 'Whitelist') {
        const allowed = await isWhitelisted(formData.recipient);
        if (!allowed) {
          setRecipientError('This address is not on the whitelist');
        } else {
          setRecipientError(null);
        }
      } else if (listMode === 'Blacklist') {
        const blocked = await isBlacklisted(formData.recipient);
        if (blocked) {
          setRecipientError('This address is blacklisted');
        } else {
          setRecipientError(null);
        }
      }
    } catch (error) {
      console.error('Failed to validate recipient:', error);
    }
  }, [formData.recipient, listMode, isWhitelisted, isBlacklisted]);

  useEffect(() => {
    if (isOpen) {
      loadListMode();
    }
  }, [isOpen, loadListMode]);

  useEffect(() => {
    if (formData.recipient && listMode !== 'Disabled') {
      validateRecipient();
    } else {
      setRecipientError(null);
    }
  }, [formData.recipient, listMode, validateRecipient]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-[600px] rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <h3 id="modal-title" className="text-xl font-semibold text-white sm:text-2xl">
              Create New Proposal
            </h3>
            {selectedTemplateName && (
              <span className="inline-flex w-fit rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                Template: {selectedTemplateName}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {listMode !== 'Disabled' && (
          <div className="mb-4 rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
            <p className="text-sm text-blue-300">
              {listMode === 'Whitelist' && 'Whitelist mode active: Only approved addresses can receive funds'}
              {listMode === 'Blacklist' && 'Blacklist mode active: Blocked addresses cannot receive funds'}
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={formData.recipient}
              onChange={(event) => onFieldChange('recipient', event.target.value)}
              placeholder="Recipient address"
              className={`w-full rounded-lg border ${recipientError ? 'border-red-500' : 'border-gray-600'
                } bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none`}
            />
            {recipientError && (
              <p className="mt-1 text-sm text-red-400">{recipientError}</p>
            )}
          </div>
          <input
            type="text"
            value={formData.token}
            onChange={(event) => onFieldChange('token', event.target.value)}
            placeholder="Token address"
            className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          />
          <input
            type="text"
            value={formData.amount}
            onChange={(event) => onFieldChange('amount', event.target.value)}
            placeholder="Amount"
            className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          />
          <textarea
            value={formData.memo}
            onChange={(event) => onFieldChange('memo', event.target.value)}
            placeholder="Memo"
            className="h-24 w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onOpenTemplateSelector}
                className="min-h-[44px] rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
              >
                Use Template
              </button>
              <button
                type="button"
                onClick={onSaveAsTemplate}
                className="min-h-[44px] rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
              >
                Save as Template
              </button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !!recipientError}
                className="min-h-[44px] rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Proposal'}
              </button>
            </div>
            {formData.token && recipientError.token && (
              <p id="token-error" className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3 w-3" />
                {recipientError.token}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Use NATIVE for XLM, or enter a valid contract/token address
            </p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
              Amount <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.0000000"
                disabled={loading}
                className={`w-full rounded-lg border bg-gray-800 px-3 py-3 pr-10 text-sm text-white placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 min-h-[44px] ${formData.amount && recipientError.amount
                  ? 'border-red-500 focus:border-red-500'
                  : formData.amount && !recipientError.amount
                    ? 'border-green-500 focus:border-green-500'
                    : 'border-gray-600 focus:border-purple-500'
                  }`}
                aria-describedby={recipientError.amount ? 'amount-error' : 'amount-hint'}
                aria-invalid={formData.amount && !!recipientError.amount}
              />
              <ValidationIndicator
                status={
                  !formData.amount ? 'empty' :
                    recipientError.amount ? 'invalid' : 'valid'
                }
              />
            </div>
            {formData.amount && recipientError.amount && (
              <p id="amount-error" className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3 w-3" />
                {recipientError}
              </p>
            )}
            <p id="amount-hint" className="text-xs text-gray-500">
              Enter amount with up to 7 decimal places (Stellar precision)
            </p>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <label htmlFor="memo" className="block text-sm font-medium text-gray-300">
              Memo <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="memo"
              value={formData.memo}
              onChange={(e) => onFieldChange('memo', e.target.value)}
              placeholder="Add a description or note for this proposal..."
              disabled={loading}
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-600 bg-gray-800 px-3 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {submitError}
              </p>
            </div>
          )}

          {/* Template Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={onOpenTemplateSelector}
              disabled={loading}
              className="min-h-[44px] flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use Template
            </button>
            <button
              type="button"
              onClick={onSaveAsTemplate}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!recipientError}
            className="min-h-[44px] w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Proposal...
              </span>
            ) : (
              'Create Proposal'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProposalModal;
